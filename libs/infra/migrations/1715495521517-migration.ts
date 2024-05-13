import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715495521517 implements MigrationInterface {
    name = 'Migration1715495521517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD "isSubscription" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD "subscriptionId" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."subscription_entity_subscriptiontype_enum" RENAME TO "subscription_entity_subscriptiontype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_entity_subscriptiontype_enum" AS ENUM('day', 'week', 'month')`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ALTER COLUMN "subscriptionType" TYPE "public"."subscription_entity_subscriptiontype_enum" USING "subscriptionType"::"text"::"public"."subscription_entity_subscriptiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_entity_subscriptiontype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_entity_subscriptiontype_enum_old" AS ENUM('ONE_DAY', 'SEVEN_DAYS', 'ONE_MONTH')`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ALTER COLUMN "subscriptionType" TYPE "public"."subscription_entity_subscriptiontype_enum_old" USING "subscriptionType"::"text"::"public"."subscription_entity_subscriptiontype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_entity_subscriptiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."subscription_entity_subscriptiontype_enum_old" RENAME TO "subscription_entity_subscriptiontype_enum"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP COLUMN "subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP COLUMN "isSubscription"`);
    }

}
