import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714561200994 implements MigrationInterface {
    name = 'Migration1714561200994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "public" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "public"`);
    }

}
