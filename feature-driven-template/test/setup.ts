import { execSync } from "child_process";
import { prisma } from "~/lib/db";

export function setup() {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test";
  execSync("pnpm prisma db push --force-reset", { stdio: "inherit" });
}

export async function teardown() {
  await prisma.$disconnect();
}
