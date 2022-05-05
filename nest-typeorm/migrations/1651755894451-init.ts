import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1651755894451 implements MigrationInterface {
  name = 'init1651755894451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "body" varchar NOT NULL, "authorId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "body" varchar NOT NULL, "authorId" integer, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_post"("id", "title", "body", "authorId") SELECT "id", "title", "body", "authorId" FROM "post"`,
    );
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
    await queryRunner.query(
      `CREATE TABLE "post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "body" varchar NOT NULL, "authorId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "post"("id", "title", "body", "authorId") SELECT "id", "title", "body", "authorId" FROM "temporary_post"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_post"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
