import { Elysia } from 'elysia'
import { UserSchema, UserParams } from './schema'

export const user = new Elysia({ prefix: '/users' })
    .model({
        'user.schema': UserSchema.body
    })
    .get('/', () => 'User Module', {
        detail: {
            description: 'fetch all users'
        }
    })
    .post('/', ({ body }) => {
        return {
            id: 1,
            username: body.username,
            role: 'user'
        }
    }, {
        body: UserSchema.body,
        response: UserSchema.response
    })
    .get('/:id', ({ params: { id } }) => {
        return {
            id,
            username: 'guest',
            role: 'guest'
        }
    }, {
        params: UserParams,
        response: UserSchema.response
    })
