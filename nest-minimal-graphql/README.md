# NestJS minimal GraphQL

`nest new --minimal` をベースにしたアカウント管理の GraphQL API です。[`src/main.ts`](src/main.ts) で GraphQL と Provider の設定を `NestFactory.create()` に渡して起動します。アカウントのドメイン、Resolver、Repository、単体テストは [`src/features/accounts/`](src/features/accounts/) に置いています。[NestJS のルートモジュールメタデータ](https://docs.nestjs.com/modules#root-module-from-metadata)

[`Account`](src/features/accounts/account.ts) の `changeDisplayName` は表示名の前後の空白を除き、空白だけの表示名を拒否します。Nest が Resolver に注入した Repository が、Drizzle で PostgreSQL に結果を保存します。

## 開発用 PostgreSQL を PGlite で起動する

Node.js 24.11 以降の 24.x と pnpm 11 が必要です。`pnpm db` は Node.js 上でインメモリの PGlite を起動し、[`db/setup.sql`](db/setup.sql) でテーブルとサンプルデータを用意します。

```sh
cd nest-minimal-graphql
pnpm install --frozen-lockfile
pnpm db
```

PGlite は `127.0.0.1:55432` で PostgreSQL クライアントからの接続を受け付けます。停止するとインメモリのデータは消えます。[PGlite Socket の使い方](https://pglite.dev/docs/pglite-socket)

## 開発時は Vite Plus でビルドし、変更時に再起動する

別のターミナルから同じディレクトリで起動します。

```sh
export DATABASE_URL='postgresql://postgres@127.0.0.1:55432/postgres?sslmode=disable'
pnpm dev
```

`pnpm dev` は `vp pack --watch` でソースの変更を監視し、ビルドが成功すると Node.js サーバーを再起動します。開発と本番で同じ [`vite.config.ts`](vite.config.ts) を使います。[Vite Plus の Pack ガイド](https://viteplus.dev/guide/pack)

[GraphiQL](http://localhost:3000/graphql) で以下のクエリを実行できます。画面の使い方は [NestJS 公式の GraphiQL のスクリーンショット](https://docs.nestjs.com/graphql/quick-start#graphql-ide) を参照してください。

```graphql
{
  accounts { id displayName }
  account(id: "2") { displayName }
}
```

表示名を変更するには、次の Mutation を実行します。

```graphql
mutation {
  changeAccountDisplayName(id: "2", displayName: "  Grace Hopper  ") {
    id
    displayName
  }
}
```

## Auth.js でパスキーを登録してログインする

`pnpm db` を起動し、API側のターミナルで `DATABASE_URL` に加えて以下を設定します。既存の PostgreSQL を使う場合は [`db/setup.sql`](db/setup.sql) を再適用して Auth.js のテーブルを作ります。

```sh
export AUTH_URL='http://localhost:3000'
export AUTH_SECRET="$(openssl rand -base64 32)"
pnpm dev
```

[パスキーのサインイン画面](http://localhost:3000/auth/signin?callbackUrl=%2Fauth%2Fsession) を開き、`passkeys@example.test` などの検証用アドレスを入力して **Sign in with Passkey** を押します。初回はブラウザーでパスキーを登録し、次回は登録したパスキーでログインします。[セッション](http://localhost:3000/auth/session) でログイン状態を確認でき、[サインアウト](http://localhost:3000/auth/signout) でセッションを終了できます。

入力したメールアドレスはパスキーを探すための識別子です。メールによる本人確認は行いません。認証情報とセッションは Auth.js のテーブルに保存します。Auth.js の Passkey Provider は公式に実験的機能として案内されています。[Auth.js の Passkey ガイド](https://authjs.dev/getting-started/providers/passkey)

## 本番用は同じ Vite Plus ビルドの成果物を起動する

`DATABASE_URL` に使う PostgreSQL の接続先を設定し、`db/setup.sql` を適用しておきます。接続プールは最初のクエリで接続します。[Drizzle の node-postgres 接続](https://orm.drizzle.team/docs/get-started/postgresql-existing)

```sh
pnpm check
pnpm build
NODE_ENV=production pnpm start
```

`pnpm build` は `vp pack` でアプリと実行時の依存パッケージを `dist/` にまとめます。エントリーポイントは `dist/main.mjs` です。`NODE_ENV=production` は起動時に設定し、GraphiQL を無効にします。[NestJS の GraphiQL 設定](https://docs.nestjs.com/graphql/quick-start#graphql-ide)

HTTP サーバーは NestJS 公式の `NodeAdapter`（`node:http`）です。GraphQL は `ApolloDriver` を使用し、ドライバーが必要とする `@as-integrations/express5` を入れています。[NestJS の HTTP アダプターと GraphQL 対応](https://docs.nestjs.com/http/performance#other-packages)

## 単体・結合・E2Eテストを実行する

- `pnpm test:unit` は `Account` の表示名変更ルールを検証します。
- `pnpm test:integration` は HTTP や GraphQL の実行器を使わず、Nest の DI で `AccountResolver`・`AccountRepository`・`Postgres` を組み立て、Resolver のメソッドを直接呼びます。ドメインのルール、PGlite への保存、入力エラー時のDBの状態をモックなしで確認します。[アカウント機能の結合テスト](src/features/accounts/account.resolver.integration.test.ts)
- `pnpm test:e2e` はビルド済みのアプリを起動し、GraphQL の更新・再取得と、Auth.js のパスキー登録・セッション確認・再ログインを HTTP 経由で検証します。パスキーの応答は Node.js の仮想認証器で生成します。[GraphQL の E2E テスト](test/graphql.e2e.test.ts)・[パスキーの E2E テスト](test/passkey.e2e.test.ts)
- `pnpm test` はビルド後にすべてのテストを実行します。
