import { TestSeeder } from "@libs/tests/test-seeder"
import { TestUtils } from "@libs/tests/test-utils"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, QueryRunner } from "typeorm"
import { DeviceEntity } from "../../../../../../../libs/infra/entities/device.entity"
import * as request from 'supertest'
import { JwtService } from "@nestjs/jwt"
import { TestingModule } from "@nestjs/testing"
import { createJwtTokens } from "@libs/jwt/create-tokens"
import { DeviceMapper } from "../../mapper/device.mapper"
import { CreateAndConfigureAppForE2eRead } from "@read/utils/create-and-configure-app-for-e2e-read"
import { UserEntity } from "@libs/infra/entities/user.entity"


describe('devices', () => {
    let app: INestApplication
    let _httpServer
    let _queryRunner: QueryRunner
    let manager: EntityManager
    let _moduleRef: TestingModule

    let testSeeder: TestSeeder

    let jwtService: JwtService

    beforeAll(async () => {

        ({
            httpServer: _httpServer,
            app: app,
            queryRunner: _queryRunner,
            manager: manager,
            moduleRef: _moduleRef
        } = await CreateAndConfigureAppForE2eRead())

        testSeeder = new TestSeeder(manager)

        jwtService = _moduleRef.get<JwtService>(JwtService)

        await app.init()

        await TestUtils.dropDb(_queryRunner)
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async () => {
        await TestUtils.dropDb(_queryRunner)
    })

    describe('devices', () => {
        let user: UserEntity;
        let devices: DeviceEntity[];
        let accessToken: string;

        beforeEach(async () => {
            const userEntity = await testSeeder.createUser(testSeeder.getUserDto())
            const devicesEntities = await testSeeder.createDevices(testSeeder.getDevicesDto(3, userEntity.id))

            user = userEntity
            devices = devicesEntities

            const tokens = await createJwtTokens(jwtService, userEntity.id, devices[0].id)
            accessToken = tokens.accessToken
        })

        it('get devices for user is success', async () => {

            const { status, body } = await request(_httpServer)
                .get('/devices')
                .set('Authorization', `Bearer ${accessToken}`)

            expect(status).toBe(HttpStatus.OK)
            expect(body.data.length).toBe(3)

            const euqalDevice = devices.map(d => DeviceMapper.fromDeviceToDeviceViewDto(d))

            expect(body.data).toEqual(euqalDevice)
        })
    })
})