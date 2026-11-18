# NestJS minimal GraphQL

`nest new --minimal` と同じ1ファイル構成の GraphQL API です。[`src/main.ts`](src/main.ts) に Code First の Resolver、Drizzle ORM の Repository、Module、起動処理を置いています。Nest が `UserRepository` を `UserResolver` のコンストラクターに型で注入します。Repository は `pg` の接続プール経由で PostgreSQL を参照します。

## PostgreSQL にテーブルとサンプルデータを用意する

Node.js 24.11 以降の 24.x、npm、PostgreSQL、`psql` が必要です。以下は `nest_graphql` データベースをローカルに用意した場合の例です。

```sh
cd nest-minimal-graphql
export DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/nest_graphql'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/setup.sql
npm ci
```

テーブル作成とサンプルデータの投入は [`db/setup.sql`](db/setup.sql) で行います。接続プールが最初に PostgreSQL へ接続するのは GraphQL のクエリを処理するときです。[Drizzle の node-postgres 接続](https://orm.drizzle.team/docs/get-started/postgresql-existing) · [PostgreSQL の `psql` マニュアル](https://www.postgresql.org/docs/current/app-psql.html)

## 開発時も Rspack でビルドし、変更時に再起動する

```sh
npm run dev
```

`npm run dev` は Vite Plus の `vp exec` から `nest start --watch` を実行します。開発時と本番ビルドは、同じ [`nest-cli.json`](nest-cli.json) と [`rspack.config.cjs`](rspack.config.cjs) を読み、SWC による TypeScript の変換、デコレーターのメタデータ出力、依存のバンドルと圧縮を行います。開発時はソースの変更を監視し、ビルドが成功するとサーバーを再起動します。[Nest CLI のビルド設定](https://docs.nestjs.com/cli/workspaces)

[GraphiQL](http://localhost:3000/graphql) で以下のクエリを実行できます。画面の使い方は [NestJS 公式の GraphiQL のスクリーンショット](https://docs.nestjs.com/graphql/quick-start#graphql-ide) を参照してください。

```graphql
{
  users { id name }
  user(id: "2") { name }
}
```

`user(id: "2")` は `{"name":"Grace"}` を返します。該当するユーザーがいない場合は `null` を返します。

## 本番用は同じ Rspack ビルドの成果物を起動する

```sh
npm run check
npm run build
NODE_ENV=production npm start
```

`npm run build` は `vp exec` から `nest build` を実行し、アプリと実行時の依存パッケージを `dist/` にまとめます。エントリーポイントは `dist/main.js` です。`NODE_ENV=production` は起動時に設定し、GraphiQL を無効にします。[NestJS の GraphiQL 設定](https://docs.nestjs.com/graphql/quick-start#graphql-ide)

HTTP サーバーは NestJS 公式の `NodeAdapter`（`node:http`）です。GraphQL は `ApolloDriver` を使用し、ドライバーが必要とする `@as-integrations/express5` を入れています。[NestJS の HTTP アダプターと GraphQL 対応](https://docs.nestjs.com/http/performance#other-packages)
