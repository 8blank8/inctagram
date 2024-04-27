import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714201397407 implements MigrationInterface {
    name = 'Migration1714201397407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."post_photo_entity_aspectratio_enum" AS ENUM('1:1', '4:5', '16:9')`);
        await queryRunner.query(`CREATE TABLE "post_photo_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "offsetX" double precision NOT NULL, "offsetY" double precision NOT NULL, "scale" double precision NOT NULL, "aspectRatio" "public"."post_photo_entity_aspectratio_enum" NOT NULL, "url" character varying NOT NULL, "postId" uuid, CONSTRAINT "PK_5c8786ad733bb509a516ed8309d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "description" character varying, "location" character varying, "userId" uuid, CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_photo_entity" ADD CONSTRAINT "FK_fc78cce4869f7fbeb48abf3deb1" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "FK_5e32998d7ac08f573cde04fbfa5" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "FK_5e32998d7ac08f573cde04fbfa5"`);
        await queryRunner.query(`ALTER TABLE "post_photo_entity" DROP CONSTRAINT "FK_fc78cce4869f7fbeb48abf3deb1"`);
        await queryRunner.query(`DROP TABLE "post_entity"`);
        await queryRunner.query(`DROP TABLE "post_photo_entity"`);
        await queryRunner.query(`DROP TYPE "public"."post_photo_entity_aspectratio_enum"`);
    }

}
