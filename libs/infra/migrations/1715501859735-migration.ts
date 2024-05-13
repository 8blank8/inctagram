import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715501859735 implements MigrationInterface {
    name = 'Migration1715501859735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_entity_accounttype_enum" AS ENUM('PERSONAL', 'BUSINESS')`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "accountType" "public"."user_entity_accounttype_enum" NOT NULL DEFAULT 'PERSONAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "accountType"`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_accounttype_enum"`);
    }

}
