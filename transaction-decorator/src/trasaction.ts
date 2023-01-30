import { db } from "./lib/db"

export const Transaction = () => {
  return (
    _target: Object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const orig = descriptor.value
    descriptor.value = () => {
      db.$transaction(async (tx) => {
        global.db = tx
        await orig()
      }).then(() => {
        global.db = null
      })
    }
  }
}
