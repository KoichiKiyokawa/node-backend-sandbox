declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "develop" | "production" | "test";
    DATABASE_URL: string;
  }
}
