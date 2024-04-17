import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713337623038 implements MigrationInterface {
    name = 'Migration1713337623038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "aboutMe" character varying`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "dateOfBirth" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "aboutMe"`);
    }

}
