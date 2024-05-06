import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateAppForE2eTestsFiles } from '@files/src/utils/tests/create-and-configure-app-for-e2e';
import { TestSeeder } from '@libs/tests/test-seeder';
import { EntityManager, QueryRunner } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { createJwtTokens } from '@libs/jwt/create-tokens';
import { TestUtils } from '@libs/tests/test-utils';
import { AspectRatioType } from '../../dto/create-post.dto';
import { PostPhotoEntity } from '../../../../../../../libs/infra/entities/post-photo.enitity';
import { PostEntity } from '../../../../../../../libs/infra/entities/post.entity';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { UserEntity } from '@libs/infra/entities/user.entity';

describe('posts file', () => {
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
        } = await CreateAppForE2eTestsFiles())

        await app.init();

        jwtService = moduleRef.get<JwtService>(JwtService)

        testSeeder = new TestSeeder(manager)

        await TestUtils.dropDb(queryRunner)
    });

    afterAll(async () => {
        await app.close();
    });

    describe('post file', () => {
        let user: UserEntity;
        let accessToken: string;
        let postEntity: PostEntity;

        beforeAll(async () => {
            user = await testSeeder.createUser(testSeeder.getUserDto(1))
            const tokens = await createJwtTokens(jwtService, user.id, '123')
            accessToken = tokens.accessToken
        })

        it('upload post with files is success', async () => {
            const res = await request(app.getHttpServer())
                .post('/posts/')
                .set('authorization', `Bearer ${accessToken}`)
                .field('offsetY', [0.8, 0.3])
                .field('offsetX', [1, 1])
                .field('scale', [1, 2])
                .field('aspectRatio', [AspectRatioType.RATIO_16_9, AspectRatioType.RATIO_1_1])
                .field('location', 'now')
                .field('description', 'qwerty')
                .attach('files', `${__dirname}/assets/cat2.jpeg`)
                .attach('files', `${__dirname}/assets/cat.jpeg`)

            expect(res.status).toBe(HttpStatus.CREATED)

            const photos = await manager.find(PostPhotoEntity, { relations: { post: true } })
            expect(photos.length).toBe(2)

            const post = await manager.find(PostEntity, { relations: { photos: true } })
            expect(post[0].photos.length).toBe(2)

            postEntity = post[0]
        })

        it('update post is success', async () => {

            const dto: UpdatePostDto = {
                description: 'new description for post'
            }

            const { status, body } = await request(_httpServer)
                .put(`/posts/${postEntity.id}`)
                .set('authorization', `Bearer ${accessToken}`)
                .send(dto)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(0)

            const findedPost = await manager.findOne(PostEntity, { where: { id: postEntity.id } })
            expect(findedPost.description).toBe(dto.description)
            expect(findedPost.updatedAt).not.toBe(null)
        })

        it('delete post is success', async () => {
            const { body } = await request(_httpServer)
                .delete(`/posts/${postEntity.id}`)
                .set('authorization', `Bearer ${accessToken}`)

            expect(body.errors.length).toBe(0)

            const findedPost = await manager.findOneBy(PostEntity, { id: postEntity.id })
            expect(findedPost).toBe(null)
        })
    })
});