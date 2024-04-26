import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity"
import { createAndConfigureAppForE2eTests } from "@inctagram/src/utils/test/create-and-configure-app-for-e2e"
import { TestSeeder } from "@libs/tests/test-seeder"
import { TestUtils } from "@libs/tests/test-utils"
import { HttpStatus, INestApplication } from "@nestjs/common"
import { EntityManager, QueryRunner } from "typeorm"
import { DeviceEntity } from "../../entities/device.entity"
import * as request from 'supertest'
import { JwtService } from "@nestjs/jwt"
import { TestingModule } from "@nestjs/testing"
import { createJwtTokens } from "@libs/jwt/create-tokens"
import { DeviceMapper } from "../../mapper/device.mapper"


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
        } = await createAndConfigureAppForE2eTests())

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

        it('delete device by id is success', async () => {
            let user2 = await testSeeder.createUser(testSeeder.getUserDto(2))
            await testSeeder.createDevices(testSeeder.getDevicesDto(2, user2.id))

            const { status, body } = await request(_httpServer)
                .delete(`/devices/${devices[0].id}`)
                .set('Authorization', `Bearer ${accessToken}`)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(0)

            const res = await request(_httpServer)
                .get('/devices')
                .set('Authorization', `Bearer ${accessToken}`)

            const equalDevices = devices.slice(1).map(d => DeviceMapper.fromDeviceToDeviceViewDto(d))

            expect(res.body.data).toEqual(equalDevices)

            const devicesUser2 = await manager.findBy(DeviceEntity, { user: { id: user2.id } })
            expect(devicesUser2.length).toBe(2)
        })

        it('delete user all devices not current device is success', async () => {
            let user2 = await testSeeder.createUser(testSeeder.getUserDto(2))
            await testSeeder.createDevices(testSeeder.getDevicesDto(2, user2.id))


            const { status, body } = await request(_httpServer)
                .delete('/devices')
                .set('Authorization', `Bearer ${accessToken}`)

            expect(status).toBe(HttpStatus.OK)
            expect(body.errors.length).toBe(0)

            const findedDevices = await manager.find(DeviceEntity, {
                where: {
                    user: {
                        id: user.id
                    }
                }
            })

            expect(findedDevices.length).toBe(1)
            expect(findedDevices[0].id).toBe(devices[0].id)

            const devicesUser2 = await manager.findBy(DeviceEntity, { user: { id: user2.id } })
            expect(devicesUser2.length).toBe(2)
        })
    })
})