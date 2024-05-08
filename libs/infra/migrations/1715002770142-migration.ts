import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715002770142 implements MigrationInterface {
    name = 'Migration1715002770142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_entity_subscriptiontype_enum" AS ENUM('ONE_DAY', 'SEVEN_DAYS', 'ONE_MONTH')`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_entity_paymentsystem_enum" AS ENUM('STRIPE', 'PAYPALL')`);
        await queryRunner.query(`CREATE TABLE "subscription_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "price" integer NOT NULL, "subscriptionType" "public"."subscription_entity_subscriptiontype_enum" NOT NULL, "paymentSystem" "public"."subscription_entity_paymentsystem_enum" NOT NULL, "expirationDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_a98819993766819c043b332748d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "subscriptionId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_7726f0601978aab27ed2fffba27" UNIQUE ("subscriptionId")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_7726f0601978aab27ed2fffba27" FOREIGN KEY ("subscriptionId") REFERENCES "subscription_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_7726f0601978aab27ed2fffba27"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_7726f0601978aab27ed2fffba27"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "subscriptionId"`);
        await queryRunner.query(`DROP TABLE "subscription_entity"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_entity_paymentsystem_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_entity_subscriptiontype_enum"`);
    }

}
