import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, QueryRunner } from "typeorm"
import { TestUtils } from "../../../../../../../libs/tests/test-utils"
import * as request from 'supertest'
import { TestSeeder } from "../../../../../../../libs/tests/test-seeder"
import { JwtService } from "@nestjs/jwt"
import { TestingModule } from "@nestjs/testing"
import { createJwtTokens } from "@libs/jwt/create-tokens"
import { CreateAppForE2eTestsRead } from "@read/utils/create-and-configure-app-for-e2e-read"


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
                .get('/users/profile')
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
    })
})