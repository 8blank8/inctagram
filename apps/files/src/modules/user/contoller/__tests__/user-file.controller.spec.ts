import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateAndConfigureAppForE2e } from '@files/src/utils/tests/create-and-configure-app-for-e2e';
import { appSetting } from '@libs/core/app-setting';
import { TestSeeder } from '@libs/tests/test-seeder';
import { EntityManager, QueryRunner } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { createJwtTokens } from '@libs/jwt/create-tokens';
import { TestUtils } from '@libs/tests/test-utils';
import { UserEntity } from '@inctagram/src/modules/user/entities/user.entity';
import { UserAvatarEntity } from '../../entities/user-avatar.entity';

describe('user avatar', () => {
    let app: INestApplication;
    let _httpServer
    let testSeeder: TestSeeder
    let manager: EntityManager
    let moduleRef: TestingModule
    let queryRunner: QueryRunner

    let jwtService: JwtService

    beforeAll(async () => {
        ({
            app: app,
            httpServer: _httpServer,
            manager: manager,
            moduleRef: moduleRef,
            queryRunner: queryRunner
        } = await CreateAndConfigureAppForE2e())

        await app.init();

        jwtService = moduleRef.get<JwtService>(JwtService)

        testSeeder = new TestSeeder(manager)

        await TestUtils.dropDb(queryRunner)
    });

    afterAll(async () => {
        await TestUtils.dropDb(queryRunner)
        await app.close();
    });

    describe('avatar', () => {
        let user: UserEntity;
        let accessToken: string;
        let avatarId: string;

        beforeAll(async () => {
            user = await testSeeder.createUser(testSeeder.getUserDto(1))
            const tokens = await createJwtTokens(jwtService, user.id, '123')
            accessToken = tokens.accessToken
        })

        it('upload user avatar is success', async () => {
            const response = await request(app.getHttpServer())
                .post('/users/avatar')
                .set('authorization', `Bearer ${accessToken}`)
                .attach('file', `${__dirname}/assets/test_image.jpeg`)
                .field('offsetX', 1)
                .field('offsetY', 0.8)
                .field('scale', 1)
            console.log(response.body)
            expect(response.status).toBe(HttpStatus.CREATED)
            expect(response.body.errors.length).toBe(0)

            const findedAvatar = await manager.findOne(UserAvatarEntity, {
                where: { id: response.body.data.id },
                relations: { user: true }
            })

            expect(findedAvatar.createdAt).not.toBe(null)
            expect(findedAvatar.updatedAt).toBe(null)
            expect(findedAvatar.user.id).toBe(user.id)
            expect(findedAvatar.offsetX).toBe(1)
            expect(findedAvatar.offsetY).toBe(0.8)
            expect(findedAvatar.scale).toBe(1)
            expect(findedAvatar.url).toBe(`${user.id}/avatar/test_image.jpeg`)

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id },
                relations: { avatar: true }
            })

            expect(findedUser.avatar).not.toBe(null)
        });

        it('upload user avatar when avatar exist is success', async () => {
            const response = await request(app.getHttpServer())
                .post('/users/avatar')
                .set('authorization', `Bearer ${accessToken}`)
                .attach('file', `${__dirname}/assets/test_image2.jpeg`)
                .field('offsetX', 0.2)
                .field('offsetY', 0.3)
                .field('scale', 1.2)

            expect(response.status).toBe(HttpStatus.CREATED)
            expect(response.body.errors.length).toBe(0)

            const findedAvatars = await manager.find(UserAvatarEntity, {
                where: { id: response.body.data.id },
                relations: { user: true }
            })

            expect(findedAvatars.length).toBe(1)

            const findedAvatar = findedAvatars[0]

            expect(findedAvatar.createdAt).not.toBe(null)
            expect(findedAvatar.updatedAt).toBe(null)
            expect(findedAvatar.user.id).toBe(user.id)
            expect(findedAvatar.offsetX).toBe(0.2)
            expect(findedAvatar.offsetY).toBe(0.3)
            expect(findedAvatar.scale).toBe(1.2)
            expect(findedAvatar.url).toBe(`${user.id}/avatar/test_image2.jpeg`)

            avatarId = findedAvatar.id

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id },
                relations: { avatar: true }
            })
            expect(findedUser.avatar).not.toBe(null)
        });

        it('delete user avatar is success', async () => {
            const response = await request(_httpServer)
                .delete(`/users/avatar/${avatarId}`)
                .set('authorization', `Bearer ${accessToken}`)

            expect(response.status).toBe(HttpStatus.OK)
            expect(response.body.errors.length).toBe(0)

            const findedAvatar = await manager.findOneBy(UserAvatarEntity, { id: avatarId })
            expect(findedAvatar).toBe(null)

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id },
                relations: { avatar: true }
            })
            expect(findedUser.avatar).toBe(null)
        })

        it('test', () => {
            expect(1).toBe(1)
        })
    })
});