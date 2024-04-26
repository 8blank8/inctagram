import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714118498952 implements MigrationInterface {
    name = 'Migration1714118498952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "black_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "black_list"`);
    }

}
