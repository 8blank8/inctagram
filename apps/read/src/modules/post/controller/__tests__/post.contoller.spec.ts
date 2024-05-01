import { TestSeeder } from "@libs/tests/test-seeder"
import { TestUtils } from "@libs/tests/test-utils"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, MoreThan, QueryRunner } from "typeorm"
import * as request from 'supertest'
import { GetPostFilterDto } from "../../filters/get-post.filter"
import { PostMapper } from "../../mapper/post.mapper"
import { CreateAppForE2eTestsRead } from "@read/utils/create-and-configure-app-for-e2e-read"
import { UserEntity } from "@libs/infra/entities/user.entity"
import { PostEntity } from "@libs/infra/entities/post.entity"


describe('posts', () => {
    let app: INestApplication
    let _httpServer
    let _queryRunner: QueryRunner
    let manager: EntityManager

    let testSeeder: TestSeeder

    beforeAll(async () => {

        ({ httpServer: _httpServer, app: app, queryRunner: _queryRunner, manager: manager } = await CreateAppForE2eTestsRead())
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
            posts = await testSeeder.createPosts(testSeeder.getPostDtos(10), user)
        })

        it('get posts is success', async () => {
            const query: GetPostFilterDto = {
                cursor: 5,
                size: 5,
                userId: user.id
            }

            const { status, body } = await request(_httpServer)
                .get('/posts')
                .query(query)

            expect(status).toBe(HttpStatus.OK)
            expect(body.data.items.length).toBe(5)
            expect(body.data.totalCount).toBe(5)

            const findedPosts = await manager.find(PostEntity, {
                where: {
                    user: {
                        id: user.id
                    },
                    cursor: MoreThan(query.cursor)
                },
                relations: { photos: true },
                order: { cursor: 'ASC' },
                take: query.size
            })

            const equalData = findedPosts.map(p => PostMapper.fromPostToPostsViewDto(p))

            expect(body.data.items).toEqual(equalData)
        })
    })
})