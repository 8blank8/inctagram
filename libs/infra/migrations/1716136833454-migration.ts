import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716136833454 implements MigrationInterface {
    name = 'Migration1716136833454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "city" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "country"`);
    }

}
