import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714124508329 implements MigrationInterface {
    name = 'Migration1714124508329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_entity" ADD "ip" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_entity" DROP COLUMN "ip"`);
    }

}
