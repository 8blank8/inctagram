import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715500132833 implements MigrationInterface {
    name = 'Migration1715500132833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP COLUMN "isActive"`);
    }

}
