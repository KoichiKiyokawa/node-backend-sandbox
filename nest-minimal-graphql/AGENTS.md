# nest-minimal-graphql の実装方針

この方針は `nest-minimal-graphql/` 以下に適用します。

## main.ts はアプリの起動と依存の登録だけを担当する

- `src/main.ts` には GraphQL の設定、Provider の登録、HTTP の待ち受けと終了処理を置きます。
- 起動は `NestFactory.create({ imports, providers }, adapter, options)` を使います。アプリ側の `AppModule` や機能別の `@Module()` クラスを省き、ルートモジュールの生成は Nest に任せます。
- 機能のドメイン、Resolver、Repository は `src/features/<feature>/` にまとめます。アカウント機能は `src/features/accounts/` に置きます。

## ドメインの操作名は業務上の動作を表す

- 対象と操作が分かる名前を使います。例は `Account.changeDisplayName()` です。表示名の変更ルールはドメインに置き、Resolver は呼び出しを受け付け、Repository は結果を保存します。
- ドメインオブジェクトはイミュータブルにします。公開プロパティは `readonly` とし、状態を変更する操作は変更後の新しいインスタンスを返します。`Account.changeDisplayName()` は元の `Account` を保持し、同じIDと新しい表示名を持つ `Account` を返します。

## 単体・結合・E2Eテストで検証する範囲

- ドメインの単体テストと機能の結合テストは対象の機能に置きます。GraphQL の結合テストでは本番と同じ Nest の構成を初期化し、Apollo で操作をプロセス内実行します。Resolver、ドメイン、Repository、Drizzle、`pg` を通し、TCP 経由で PGlite に接続します。
- 状態を変更するドメイン操作の単体テストでは、返された値と、元のインスタンスが保持している値の両方を確認します。
- E2Eテストは `test/` に置き、ビルド済みのアプリを起動して、GraphQL の HTTP 経由の更新・再取得と Auth.js のパスキー認証を検証します。単体・結合・E2Eテストで、プロジェクトが管理する依存には実装を使います。
- `pnpm check` で型と lint を確認し、`pnpm test` でビルド後にすべてのテストを実行します。
