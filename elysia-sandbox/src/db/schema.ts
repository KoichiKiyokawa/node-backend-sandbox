import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull(),
    password: text('password').notNull(),
    role: text('role').default('user').notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
