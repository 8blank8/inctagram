import { createAndConfigureAppForE2eTests } from "@inctagram/src/utils/test/create-and-configure-app-for-e2e"
import { TestSeeder } from "@libs/tests/test-seeder"
import { TestUtils } from "@libs/tests/test-utils"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, QueryRunner } from "typeorm"
import * as request from 'supertest'
import { GetPostFilterDto } from "../../filters/get-post.filter"
import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity"
import { PostEntity } from "@files/src/modules/post/entities/post.entity"
import { PostMapper } from "../../mapper/post.mapper"


describe('posts', () => {
    let app: INestApplication
    let _httpServer
    let _queryRunner: QueryRunner
    let manager: EntityManager

    let testSeeder: TestSeeder

    beforeAll(async () => {

        ({ httpServer: _httpServer, app: app, queryRunner: _queryRunner, manager: manager } = await createAndConfigureAppForE2eTests())
        testSeeder = new TestSeeder(manager)

        await app.init()

        await TestUtils.dropDb(_queryRunner)
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        await TestUtils.dropDb(_queryRunner)
    })

    describe('posts', () => {
        let user: UserEntity
        let posts: PostEntity[]

        beforeEach(async () => {
            user = await testSeeder.createUser(testSeeder.getUserDto(1))
            posts = await testSeeder.createPosts(testSeeder.getPostDtos(2), user)
        })

        it('get posts is success', async () => {
            const query: GetPostFilterDto = {
                page: 0,
                size: 5,
                userId: user.id
            }

            const { status, body } = await request(_httpServer)
                .get('/posts')
                .query(query)

            expect(status).toBe(HttpStatus.OK)
            expect(body.data.items.length).toBe(2)
            expect(body.data.totalCount).toBe(2)

            const findedPosts = await manager.find(PostEntity, {
                where: {
                    user: {
                        id: user.id
                    }
                },
                relations: { photos: true },
                skip: query.page * query.size,
                take: query.size
            })

            const equalData = findedPosts.map(p => PostMapper.fromPostToPostsViewDto(p))

            expect(body.data.items).toEqual(equalData)
        })
    })
})