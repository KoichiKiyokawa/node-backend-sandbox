# NestJS minimal GraphQL

`nest new --minimal` をベースにしたアカウント管理の GraphQL API です。[`src/main.ts`](src/main.ts) でアプリを起動し、[`AppModule`](src/app.module.ts) が GraphQL と [`AccountsModule`](src/features/accounts/accounts.module.ts) を組み合わせます。アカウントのドメイン、Resolver、Repository、単体テストは [`src/features/accounts/`](src/features/accounts/) に置いています。

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

## 本番用は同じ Vite Plus ビルドの成果物を起動する

`DATABASE_URL` に使う PostgreSQL の接続先を設定し、`db/setup.sql` を適用しておきます。接続プールは最初のクエリで接続します。[Drizzle の node-postgres 接続](https://orm.drizzle.team/docs/get-started/postgresql-existing)

```sh
pnpm check
pnpm build
NODE_ENV=production pnpm start
```

`pnpm build` は `vp pack` でアプリと実行時の依存パッケージを `dist/` にまとめます。エントリーポイントは `dist/main.mjs` です。`NODE_ENV=production` は起動時に設定し、GraphiQL を無効にします。[NestJS の GraphiQL 設定](https://docs.nestjs.com/graphql/quick-start#graphql-ide)

HTTP サーバーは NestJS 公式の `NodeAdapter`（`node:http`）です。GraphQL は `ApolloDriver` を使用し、ドライバーが必要とする `@as-integrations/express5` を入れています。[NestJS の HTTP アダプターと GraphQL 対応](https://docs.nestjs.com/http/performance#other-packages)

## ドメインの単体テストと GraphQL の結合テストを実行する

`pnpm test` は両方を実行します。`pnpm test:unit` は `Account` の表示名変更を単独で検証します。`pnpm test:integration` はビルド後、PGlite と API を空きポートで起動し、HTTP 経由で取得・変更・入力エラーを検証します。結合テストではアプリの Resolver、Repository、Drizzle、`pg` をそのまま使い、変更後のDBの値も確認します。[Vite Plus の Test ガイド](https://viteplus.dev/guide/test)
