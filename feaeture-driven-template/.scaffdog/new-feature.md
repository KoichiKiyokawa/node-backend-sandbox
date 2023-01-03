---
name: "new-feature"
root: "src"
output: "."
ignore: []
questions:
  name: "Please input the feature name."
---

# index.ts
```ts
import '~/features/{{inputs.name|kebab}}/{{inputs.name|kebab}}.route'
{{ read output.abs }}
```

# `features/{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.route.ts`

```ts
import { app } from "~/lib/app"
import { {{ inputs.name | snake -}}Service } from "./{{ inputs.name | kebab }}.service"

app.get("/{{ inputs.name | plur 2 }}", async (req, res) => {
  res.json(await {{ inputs.name | camel -}}Service.findAll())
})

```

# `features/{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.repository.ts`

```ts
import { db } from "~/lib/db"
import type { PrismaClient, {{inputs.name|pascal}} } from '@prisma/client'

class {{ inputs.name | pascal -}}Repository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  findAll(): Promise<{{inputs.name|pascal}}[]> {
    return this.db.{{inputs.name|camel}}.findMany()
  }
}

export const {{ inputs.name | camel -}}Repository = new {{ inputs.name | pascal -}}Repository(db)
export const get{{inputs.name|pascal}}RepositoryForTest = (mockDB: PrismaClient) => new {{inputs.name|pascal}}Repository(mockDB);

```

# `features/{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.repository.test.ts`

```ts
import { usePrismaTest } from '~/../test/use-prisma-test'
import { get{{- inputs.name | pascal -}}RepositoryForTest } from "./{{ inputs.name | kebab }}.repository"

describe("{{ inputs.name | camel -}}Repository", () => {
  const mockDB = usePrismaTest()
  it("findAll", async () => {
    await mockDB.{{inputs.name|camel}}.create({ data: {/* dummy data */}})
    const {{ inputs.name | camel -}}Repository = get{{- inputs.name | pascal -}}RepositoryForTest(mockDB)
    expect(await {{ inputs.name | camel -}}Repository.findAll()).toStrictEqual([
      {/* dummy data */}
    ])
  })
})

```

# `features/{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.service.ts`

```ts
import { {{ inputs.name | camel -}}Repository } from "./{{ inputs.name | kebab }}.repository"

class {{ inputs.name | pascal -}}Service {
  findAll() {
    return {{ inputs.name | camel -}}Repository.findAll()
  }
}

export const {{inputs.name | camel}}Service = new {{ inputs.name | pascal}}Service()
```

# `features/{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.service.test.ts`

```ts
import { vi } from "vitest"
import { {{inputs.name|camel}}Repository } from "./{{inputs.name|kebab}}.repository"
import { {{inputs.name|camel}}Service } from "./{{inputs.name|kebab}}.service"

describe("{{inputs.name|pascal}}", () => {
  it("findAll", async () => {
    vi.spyOn({{inputs.name|camel}}Repository, "findAll").mockImplementation(async () => [
      {/* dummy data */}
    ])
    expect(await {{inputs.name|camel}}Service.findAll()).toStrictEqual([
      {/* dummy data */}
    ])
  })
})
```