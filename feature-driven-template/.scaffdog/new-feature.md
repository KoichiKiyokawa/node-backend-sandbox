---
name: "new-feature"
root: "src"
output: "."
ignore: []
questions:
  name: "Please input the feature name."
---


# Variables
- kebab: {{inputs.name|kebab}}
- pascal: {{inputs.name|pascal}}
- camel: {{inputs.name|camel}}

# index.ts
```ts
import '~/features/{{kebab}}/{{kebab}}.route'
{{ read output.abs }}
```

# `features/{{ kebab }}/{{ kebab }}.route.ts`

```ts
import { app } from "~/lib/app"
import { {{ camel }}Service } from "./{{ kebab }}.service"

app.get("/{{ plur 2 }}", async (req, res) => {
  res.json(await {{ camel }}Service.findAll())
})

```

# `features/{{ kebab }}/{{ kebab }}.repository.ts`

```ts
import { db } from "~/lib/db"
import type { PrismaClient, {{pascal}} } from '@prisma/client'

class {{ pascal }}Repository {
  constructor(private readonly db: PrismaClient) {}

  findAll(): Promise<{{pascal}}[]> {
    return this.db.{{camel}}.findMany()
  }
}

export const {{ camel }}Repository = new {{ pascal }}Repository(db)
export const get{{pascal}}RepositoryForTest = (mockDB: PrismaClient) => new {{pascal}}Repository(mockDB);

```

# `features/{{ kebab }}/{{ kebab }}.repository.test.ts`

```ts
import { usePrismaTest } from '~/../test/use-prisma-test'
import { get{{ pascal }}RepositoryForTest } from "./{{ kebab }}.repository"

describe("{{pascal}}Repository", () => {
  it("findAll", () =>
    usePrismaTest(async (mockDB) => {
      await mockDB.{{camel}}.create({
        data: {/* dummy data */}
      });
      const {{camel}}Repository = get{{pascal}}RepositoryForTest(mockDB)
      expect(await {{camel}}Repository.findAll()).toStrictEqual([
        {/* dummy data */}
      ]);
    }));
});


```

# `features/{{ kebab }}/{{ kebab }}.service.ts`

```ts
import { {{ camel }}Repository } from "./{{ kebab }}.repository"

class {{ pascal }}Service {
  findAll() {
    return {{ camel }}Repository.findAll()
  }
}

export const {{camel}}Service = new {{ pascal}}Service()
```

# `features/{{ kebab }}/{{ kebab }}.service.test.ts`

```ts
import { vi } from "vitest"
import { {{camel}}Repository } from "./{{kebab}}.repository"
import { {{camel}}Service } from "./{{kebab}}.service"

describe("{{pascal}}", () => {
  it("findAll", async () => {
    vi.spyOn({{camel}}Repository, "findAll").mockImplementation(async () => [
      {/* dummy data */}
    ])
    expect(await {{camel}}Service.findAll()).toStrictEqual([
      {/* dummy data */}
    ])
  })
})
```