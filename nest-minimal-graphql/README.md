# NestJS minimal GraphQL

`nest new --minimal` と同じ1ファイル構成の GraphQL API です。[`src/main.ts`](src/main.ts) に Code First の Resolver、インメモリの Repository、Module、起動処理を置いています。Nest が `UserRepository` を `UserResolver` のコンストラクターに型で注入します。

## 開発時は Vite Plus で起動する

Node.js 24.11 以降の 24.x と npm が必要です。

```sh
cd nest-minimal-graphql
npm ci
npm run dev
```

`npm run dev` は `vite-plus/register` で TypeScript を変換し、Node.js の `--watch` でファイルの変更時に再起動します。`emitDecoratorMetadata` を有効にしているため、開発時もコンストラクター注入が動きます。[Vite Plus の TypeScript ローダー](https://viteplus.dev/guide/vpx#using-node-js-directly)

[GraphiQL](http://localhost:3000/graphql) で以下のクエリを実行できます。画面の使い方は [NestJS 公式の GraphiQL のスクリーンショット](https://docs.nestjs.com/graphql/quick-start#graphql-ide) を参照してください。

```graphql
{
  users { id name }
  user(id: "2") { name }
}
```

`user(id: "2")` は `{"name":"Grace"}` を返します。該当するユーザーがいない場合は `null` を返します。

## 本番用は Nest CLI の Rspack でビルドする

```sh
npm run check
npm run build
NODE_ENV=production npm start
```

Nest CLI の Rspack ビルダーが、アプリと実行時の依存パッケージを `dist/` にまとめます。エントリーポイントは `dist/main.js` です。ビルダー内の SWC がデコレーターのメタデータを出力します。[`rspack.config.cjs`](rspack.config.cjs) で Node.js の組み込みモジュールを外部に残し、未インストールのオプション依存をスキップします。[NestJS 公式のコールドスタート計測](https://docs.nestjs.com/faq/serverless#benchmarks)

HTTP サーバーは NestJS 公式の `NodeAdapter`（`node:http`）です。GraphQL は `ApolloDriver` を使用し、ドライバーが必要とする `@as-integrations/express5` を入れています。[NestJS の HTTP アダプターと GraphQL 対応](https://docs.nestjs.com/http/performance#other-packages)
