# nest-minimal-graphql の実装方針

この方針は `nest-minimal-graphql/` 以下に適用します。

## main.ts はアプリの起動と依存の登録だけを担当する

- `src/main.ts` には GraphQL の設定、Provider の登録、HTTP の待ち受けと終了処理を置きます。
- 起動は `NestFactory.create({ imports, providers }, adapter, options)` を使います。アプリ側の `AppModule` や機能別の `@Module()` クラスを省き、ルートモジュールの生成は Nest に任せます。
- 機能のドメイン、Resolver、Repository は `src/features/<feature>/` にまとめます。アカウント機能は `src/features/accounts/` に置きます。

## ドメインの操作名は業務上の動作を表す

- 対象と操作が分かる名前を使います。例は `Account.changeDisplayName()` です。表示名の変更ルールはドメインに置き、Resolver は呼び出しを受け付け、Repository は結果を保存します。

## 機能内の単体テストと結合テストで確認する

- ドメインの単体テストは対象の機能に置きます。GraphQL の結合テストは `test/` に置き、管理下の Resolver、Repository、ドメインは実装を使います。
- `pnpm check` で型とlintを確認し、`pnpm test` でビルド、単体テスト、PGliteを使ったGraphQLの結合テストを実行します。
