import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714974619765 implements MigrationInterface {
    name = 'Migration1714974619765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "confirmationCode" TO "confirmationId"`);
        await queryRunner.query(`CREATE TABLE "email_confirmation_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "confirmationCode" character varying NOT NULL, CONSTRAINT "PK_f3a40a62b76c0f614e6c966cdf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "confirmationId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "confirmationId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_39da1fbebef934c135480027a49" UNIQUE ("confirmationId")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_39da1fbebef934c135480027a49" FOREIGN KEY ("confirmationId") REFERENCES "email_confirmation_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_39da1fbebef934c135480027a49"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_39da1fbebef934c135480027a49"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "confirmationId"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "confirmationId" character varying`);
        await queryRunner.query(`DROP TABLE "email_confirmation_entity"`);
        await queryRunner.query(`ALTER TABLE "user_entity" RENAME COLUMN "confirmationId" TO "confirmationCode"`);
    }

}
