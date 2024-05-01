import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714554342291 implements MigrationInterface {
    name = 'Migration1714554342291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "cursor" SERIAL NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "cursor"`);
    }

}
