import {
  ClassDeclaration,
  Project,
  ts,
  SyntaxKind,
  VariableDeclarationKind,
  Identifier,
  Symbol,
  ParameterDeclaration,
} from "ts-morph"
import { camelize } from "./utils"

const project = new Project({
  tsConfigFilePath: "./demo/tsconfig.json",
})

const sourceFile = project.getSourceFile("./demo/src/wire.ts")
if (sourceFile == null) throw Error("Source file not found")

const providerIdentifiers = sourceFile
  .getVariableDeclaration("providers")
  ?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression) // [FooRepository, BarRepository, FooService]
  ?.getFirstChildByKind(SyntaxKind.SyntaxList) // FooRepository, BarRepository, FooService
  ?.getChildrenOfKind(SyntaxKind.Identifier) // Identifier(FooRepository), Identifier(BarRepository), Identifier(FooService)

if (providerIdentifiers == null) throw Error("Providers not found")

providerIdentifiers.forEach((p) => {
  console.log(p.getText())
  console.log(p.getDefinitions()[0].getKind())
})

class Provider {
  constructor(private readonly identifier: Identifier) {}

  initializeCost: number | undefined = undefined

  getDefinitionKind() {
    return this.identifier.getDefinitions()[0].getKind()
  }

  getInitializeParameters() {
    switch (this.getDefinitionKind()) {
      case ts.ScriptElementKind.classElement:
        return this.identifier
          .getDefinitionNodes()[0]
          .asKind(SyntaxKind.ClassDeclaration)!
          .getConstructors()[0]
          .getParameters()
      case ts.ScriptElementKind.functionElement:
        return this.identifier
          .getDefinitionNodes()[0]
          .asKind(SyntaxKind.FunctionDeclaration)!
          .getParameters()
    }
    return []
  }

  getDependencyDefinitions() {
    return this.getInitializeParameters().flatMap(
      (p) =>
        p
          .getLastChildByKind(SyntaxKind.TypeReference)
          ?.getFirstChildByKind(SyntaxKind.Identifier)
          ?.getDefinitionNodes()[0] ?? []
    )
  }
}

// evaluate initialize cost
// if ModuleA depends on ModuleB(initializeCost: 1) and ModuleB(initializeCost: 2), ModuleA's initializeCost is 3(=1+2)

const generatingFile = project.createSourceFile(
  sourceFile.getFilePath().replace("wire.ts", "wire-generated.ts"),
  "",
  {
    overwrite: true,
  }
)

for (const provider of providers) {
  const [def] = provider.identifier.getDefinitionNodes()
  if (def.isKind(SyntaxKind.ClassDeclaration)) {
    resolveClassDeclaration(def)
  } else {
    // TODO: resolve exported value. e.g. export const db = new DB()
    // console.log(def.getType())
  }
}

function resolveClassDeclaration(classDeclaration: ClassDeclaration) {
  const constructor = classDeclaration.getConstructors()[0]
  const dependencies =
    constructor
      ?.getParameters()
      .flatMap(
        (p) =>
          p
            .getLastChildByKind(SyntaxKind.TypeReference)
            ?.getFirstChildByKind(SyntaxKind.Identifier) ?? []
      ) ?? []

  // add variable statements (const fooRepository = new FooRepository())
  const className = classDeclaration.getName()
  if (className === undefined)
    throw Error(`Class name not found: ${classDeclaration.getText()}`)

  const instanceName = camelize(className)
  generatingFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: instanceName,
        initializer: `new ${classDeclaration.getName()}(${dependencies
          .map((dep) => {
            const [definition] = dep.getDefinitionNodes()
            // if dependency is in providers, use it. e.g. new FooRepository(db)
            const provided = providers?.find((p) => {
              const implKind = p.getImplementations()[0].getKind()
              return (
                (implKind === ts.ScriptElementKind.constElement ||
                  implKind === ts.ScriptElementKind.letElement) &&
                p.getType().getSymbol() === dep.getType().getSymbol()
              )
            })
            if (provided) return provided.getText()

            // needs instantiation
            if (definition.isKind(SyntaxKind.ClassDeclaration))
              return camelize(dep.getText())
          })
          .join(", ")})`,
      },
    ],
  })
}

generatingFile.fixMissingImports()
generatingFile.saveSync()
