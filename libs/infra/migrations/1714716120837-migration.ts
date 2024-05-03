import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714716120837 implements MigrationInterface {
    name = 'Migration1714716120837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "public" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "public"`);
    }

}
