import { execSync } from "child_process";
import { prisma } from "~/lib/db";

export function setup() {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test";
  execSync(`docker compose exec db psql -U postgres -c 'DROP DATABASE IF EXISTS test;'`, {
    stdio: "inherit",
  });
  execSync(`docker compose exec db psql -U postgres -c 'CREATE DATABASE test;'`, {
    stdio: "inherit",
  });
  execSync("pnpm prisma db push", { stdio: "inherit" });
}

export async function teardown() {
  await prisma.$disconnect();
}
