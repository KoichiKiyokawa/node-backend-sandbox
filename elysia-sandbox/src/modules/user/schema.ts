import { t } from 'elysia'

export const UserSchema = {
    body: t.Object({
        username: t.String({ description: 'ユーザー名' }),
        password: t.String({ description: 'パスワード' })
    }),
    response: {
        200: t.Object({
            id: t.Number({ description: 'ユーザーID' }),
            username: t.String({ description: 'ユーザー名' }),
            role: t.String({ description: '権限' })
        })
    }
}

export const UserParams = t.Object({
    id: t.Numeric({ description: 'ユーザーID' })
})
