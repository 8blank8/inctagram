import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, QueryRunner } from "typeorm"
import { TestUtils } from "../../../../../../../libs/tests/test-utils"
import * as request from 'supertest'
import { TestSeeder } from "../../../../../../../libs/tests/test-seeder"
import { JwtService } from "@nestjs/jwt"
import { TestingModule } from "@nestjs/testing"
import { createJwtTokens } from "@libs/jwt/create-tokens"
import { CreateAppForE2eTestsRead } from "@read/utils/create-and-configure-app-for-e2e-read"
import { UserEntity } from "@libs/infra/entities/user.entity"
import { UserMapper } from "../../mapper/user.mapper"


describe('user', () => {
    let app: INestApplication
    let _httpServer
    let _queryRunner: QueryRunner
    let manager: EntityManager
    let moduleRef: TestingModule

    let jwtService: JwtService

    let testSeeder: TestSeeder

    beforeAll(async () => {

        ({
            httpServer: _httpServer,
            app: app,
            queryRunner: _queryRunner,
            manager: manager,
            moduleRef
        } = await CreateAppForE2eTestsRead())
        testSeeder = new TestSeeder(manager)

        jwtService = moduleRef.get<JwtService>(JwtService)

        await app.init()

        await TestUtils.dropDb(_queryRunner)
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        await TestUtils.dropDb(_queryRunner)
    })

    describe('user', () => {

        it('get user profile is success', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())
            const accessToken = (await createJwtTokens(jwtService, user.id, 'asd')).accessToken

            const { status, body } = await request(_httpServer)
                .get('/users/me')
                .set({
                    'Authorization': `Bearer ${accessToken}`,
                })

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(0)

            expect(body.data).toEqual({
                id: user.id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                aboutMe: user.aboutMe,
                dateOfBirth: user.dateOfBirth,
                createdAt: user.createdAt.toISOString(),
                updatedAt: null,
                avatar: null
            })
        })

        it('get user profile by id is success', async () => {
            const users = await testSeeder.createUsers(testSeeder.getUserDtos(2))

            const res = await request(_httpServer)
                .get(`/users/profile/${users[0].id}`)

            const findedUser = await manager.findOne(UserEntity, {
                where: {
                    id: users[0].id,
                    public: true
                },
                relations: {
                    avatar: true
                }
            })

            const equalData = UserMapper.fromUserToUserProfileViewDto(findedUser)

            expect(res.body.data).toEqual(equalData)
        })

        it('get total count users is success', async () => {

            await testSeeder.createUsers(testSeeder.getUserDtos(9))

            const { body } = await request(_httpServer)
                .get('/users/total-count')

            expect(body.data.count).toBe(10)
        })
    })
})