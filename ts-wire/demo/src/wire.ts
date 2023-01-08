import {
  BarRepository,
  db,
  FooController,
  FooRepository,
  FooService,
} from "./foo"

export const providers = [
  db,
  FooRepository,
  BarRepository,
  FooService,
  FooController,
]

export function bootstrap(...leaves: unknown[]) {
  console.log(leaves)
}
