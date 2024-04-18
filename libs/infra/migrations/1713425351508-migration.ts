import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713425351508 implements MigrationInterface {
    name = 'Migration1713425351508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_avatar_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "url" character varying NOT NULL, "offsetX" double precision NOT NULL, "offsetY" double precision NOT NULL, "scale" double precision NOT NULL, CONSTRAINT "PK_6b1e76728b27f2a0538233bc257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "avatarId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_b8ff7c4949e12585b6ba48ec676" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_b8ff7c4949e12585b6ba48ec676" FOREIGN KEY ("avatarId") REFERENCES "user_avatar_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_b8ff7c4949e12585b6ba48ec676"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_b8ff7c4949e12585b6ba48ec676"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "avatarId"`);
        await queryRunner.query(`DROP TABLE "user_avatar_entity"`);
    }

}
