import { Elysia } from 'elysia'
import { UserSchema, UserParams } from './schema'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const user = new Elysia({ prefix: '/users' })
    .model({
        'user.schema': UserSchema.body
    })
    .get('/', async () => {
        return await db.select().from(users)
    }, {
        detail: {
            description: 'fetch all users'
        }
    })
    .post('/', async ({ body }) => {
        const [newUser] = await db.insert(users).values({
            username: body.username,
            password: body.password,
            role: 'user'
        }).returning()
        return newUser
    }, {
        body: UserSchema.body,
        response: UserSchema.response
    })
    .get('/:id', async ({ params: { id } }) => {
        const [foundUser] = await db.select().from(users).where(eq(users.id, id))
        return foundUser
    }, {
        params: UserParams,
        response: UserSchema.response
    })
