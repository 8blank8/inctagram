import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, QueryRunner } from "typeorm"
import { TestUtils } from "../../../../../../../libs/tests/test-utils"
import * as request from 'supertest'
import { TestSeeder } from "../../../../../../../libs/tests/test-seeder"
import { UpdateUserDto } from "../../dto/update-user.dto"
import { JwtService } from "@nestjs/jwt"
import { TestingModule } from "@nestjs/testing"
import { UserEntity } from "../../../../../../../libs/infra/entities/user.entity"
import { CreateAppForE2eTestsMain } from "@inctagram/src/utils/test/create-and-configure-app-for-e2e"
import { createJwtTokens } from "@libs/jwt/create-tokens"


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
        } = await CreateAppForE2eTestsMain())
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

        it('update user is success', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())
            const accessToken = (await createJwtTokens(jwtService, user.id, 'asd')).accessToken

            const dto: UpdateUserDto = {
                username: user.username,
                firstname: "Abra",
                lastname: "Kadabra",
                dateOfBirth: '03.10.2000',
                aboutMe: 'this is text about me'
            }

            const { status, body } = await request(_httpServer)
                .put('/users/profile')
                .set({
                    'Authorization': `Bearer ${accessToken}`,
                })
                .send(dto)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(0)

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id }
            })

            expect(findedUser.firstname).toBe(dto.firstname)
            expect(findedUser.lastname).toBe(dto.lastname)
            expect(findedUser.aboutMe).toBe(dto.aboutMe)
            expect(findedUser.dateOfBirth.toISOString()).toBe(new Date(dto.dateOfBirth).toISOString())
            expect(findedUser.username).toBe(dto.username)
            expect(findedUser.updatedAt).not.toBe(null)
        })

        it('update user is failed email not confirmed', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto(), { emailConfirmed: false })
            const accessToken = (await createJwtTokens(jwtService, user.id, 'asd')).accessToken

            const dto: UpdateUserDto = {
                username: user.username,
                firstname: "Abra",
                lastname: "Kadabra",
                dateOfBirth: '03.10.2000',
                aboutMe: 'this is text about me'
            }

            const { status, body } = await request(_httpServer)
                .put('/users/profile')
                .set({
                    'Authorization': `Bearer ${accessToken}`,
                })
                .send(dto)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(1)

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id }
            })

            expect(findedUser.firstname).toBe(null)
            expect(findedUser.lastname).toBe(null)
            expect(findedUser.aboutMe).toBe(null)
            expect(findedUser.dateOfBirth).toBe(null)
            expect(findedUser.username).toBe(user.username)
            expect(findedUser.updatedAt).toBe(null)
        })

        it('update user is failed username exist', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())
            const user2 = await testSeeder.createUser(testSeeder.getUserDto(2))
            const accessToken = (await createJwtTokens(jwtService, user.id, 'asd')).accessToken

            const dto: UpdateUserDto = {
                username: user2.username,
                firstname: "Abra",
                lastname: "Kadabra",
                dateOfBirth: '03.10.2000',
                aboutMe: 'this is text about me'
            }

            const { status, body } = await request(_httpServer)
                .put('/users/profile')
                .set({
                    'Authorization': `Bearer ${accessToken}`,
                })
                .send(dto)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(1)

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id }
            })

            expect(findedUser.firstname).toBe(null)
            expect(findedUser.lastname).toBe(null)
            expect(findedUser.aboutMe).toBe(null)
            expect(findedUser.dateOfBirth).toBe(null)
            expect(findedUser.username).toBe(user.username)
            expect(findedUser.updatedAt).toBe(null)
        })

        it('update user is failed user year < 13', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())
            const accessToken = (await createJwtTokens(jwtService, user.id, 'asd')).accessToken

            const dto: UpdateUserDto = {
                username: user.username,
                firstname: "Abra",
                lastname: "Kadabra",
                dateOfBirth: '17.04.2022',
                aboutMe: 'this is text about me'
            }

            const { status, body } = await request(_httpServer)
                .put('/users/profile')
                .set({
                    'Authorization': `Bearer ${accessToken}`,
                })
                .send(dto)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(1)

            const findedUser = await manager.findOne(UserEntity, {
                where: { id: user.id }
            })

            expect(findedUser.firstname).toBe(null)
            expect(findedUser.lastname).toBe(null)
            expect(findedUser.aboutMe).toBe(null)
            expect(findedUser.dateOfBirth).toBe(null)
            expect(findedUser.username).toBe(user.username)
            expect(findedUser.updatedAt).toBe(null)
        })
    })
})