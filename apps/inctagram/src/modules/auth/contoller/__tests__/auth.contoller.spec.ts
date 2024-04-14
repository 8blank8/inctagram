import { HttpStatus, INestApplication } from "@nestjs/common"
import { createAndConfigureAppForTests } from "../../../../../../../libs/tests/create-and-configure-app"
import { EntityManager, QueryRunner } from "typeorm"
import { TestUtils } from "../../../../../../../libs/tests/test-utils"
import * as request from 'supertest'
import { TestSeeder } from "../../../../../../../libs/tests/test-seeder"
import { UserEntity } from "../../../user/entities/user.entity"
import { LoginUserDto } from "../../dto/input/login-user.dto"
import { DeviceEntity } from "../../../device/entities/device.entity"
import { CreateUserCommand } from "../../../user/use-cases/create/dto/create-user.command"
import { ConfirmationUserCommand } from "../../use-cases/confirmation/dto/confirmation-user.command"
import { ResetUserPasswordCommand } from "../../use-cases/recovery-password/dto/reset-user-password.command"


describe('auth', () => {
    let app: INestApplication
    let _httpServer
    let _queryRunner: QueryRunner
    let manager: EntityManager

    let testSeeder: TestSeeder

    beforeAll(async () => {

        ({ httpServer: _httpServer, app: app, queryRunner: _queryRunner, manager: manager } = await createAndConfigureAppForTests())
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

    describe('registration', () => {
        it('registration user success', async () => {

            const userDto = testSeeder.getUserDto()

            const { status, body } = await request(_httpServer)
                .post('/auth/registration')
                .send(userDto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.data).toEqual({
                id: expect.any(String)
            })

            const user = await manager.findOne(UserEntity, {
                where: {
                    id: body.data.id
                }
            })

            expect(user.email).toBe(userDto.email)
            expect(user.emailConfirmed).toBe(false)
            expect(user.username).toBe(userDto.username)
        })

        it('registration other user mail not confirmed', async () => {
            const userDto = testSeeder.getUserDto()

            const res = await request(_httpServer)
                .post('/auth/registration')
                .send(userDto)

            const user = await manager.findOne(UserEntity, {
                where: {
                    id: res.body.data.id
                }
            })
            expect(user.emailConfirmed).toBe(false)

            const dto = {
                email: "asdqwe@yandex.ru",
                password: 'password1$',
                username: 'username1'
            }

            const { status, body } = await request(_httpServer)
                .post('/auth/registration')
                .send(dto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.data).toEqual({
                id: expect.any(String)
            })

            const users = await manager.find(UserEntity)
            const findUser = users[0]

            expect(users.length).toBe(1)
            expect(findUser.email).toBe(dto.email)
            expect(findUser.username).toBe(dto.username)
            expect(findUser.emailConfirmed).toBe(false)

        })
    })

    describe('resend confirmation code', () => {
        it('resend confirmation code success', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto(), { emailConfirmed: false })

            const { body, status } = await request(_httpServer)
                .post('/auth/resend-email-code')
                .send(user.email)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(0)
        })

        it('resend confirmation code fail user is confirmed', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())

            const { body, status } = await request(_httpServer)
                .post('/auth/resend-email-code')
                .send(user.email)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.resultCode).toBe(1)
            expect(body.errors.length).toBe(1)
        })

        it('resend confirmation code fail user not found', async () => {
            const { body, status } = await request(_httpServer)
                .post('/auth/resend-email-code')
                .send('tes@gmail.com')

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.resultCode).toBe(1)
            expect(body.errors.length).toBe(1)
        })
    })

    describe('confirm email code', () => {
        it('confirmation email is success', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto(), { emailConfirmed: false })

            const confirmCodeDto: ConfirmationUserCommand = {
                code: user.confirmationCode
            }

            const { status, body } = await request(_httpServer)
                .post('/auth/confirm-code')
                .send(confirmCodeDto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(0)

            const findedUser = await manager.findOneBy(UserEntity, { id: user.id })
            expect(findedUser.emailConfirmed).toBe(true)
        })

        it('confirmation email user not found', async () => {
            const confirmCodeDto: ConfirmationUserCommand = {
                code: '1234'
            }

            const { status, body } = await request(_httpServer)
                .post('/auth/confirm-code')
                .send(confirmCodeDto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(1)
        })

        it('confirmation email user is confirmed', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())

            const confirmCodeDto: ConfirmationUserCommand = {
                code: user.confirmationCode
            }

            const { status, body } = await request(_httpServer)
                .post('/auth/confirm-code')
                .send(confirmCodeDto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(1)
        })
    })

    describe('login', () => {
        let userDto: CreateUserCommand;
        let userEntity: UserEntity;
        let loginDto: LoginUserDto;

        beforeEach(async () => {
            userDto = testSeeder.getUserDto()
            userEntity = await testSeeder.createUser(userDto)

            loginDto = {
                email: userDto.email,
                password: userDto.password
            }
        })

        it('login user is success', async () => {
            const { status, body, headers } = await request(_httpServer)
                .post('/auth/login')
                .set('user-agent', 'test-agent')
                .send(loginDto)

            let refreshTokenCookie: string | null = null
            refreshTokenCookie = headers['set-cookie'][0]

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.data).toEqual({
                accessToken: expect.any(String)
            })
            expect(refreshTokenCookie).not.toBe(null)

            const findedUserWithDevices = await manager.findOne(UserEntity, {
                where: { id: userEntity.id },
                relations: { devices: true }
            })

            expect(findedUserWithDevices.devices.length).toBe(1)

            const devices = await manager.find(DeviceEntity, { relations: { user: true } })
            const device = devices[0]

            expect(device.title).toBe('test-agent')
            expect(device.user.id).toBe(userEntity.id)
        })

        it('login user incorrect password', async () => {
            const { status, body } = await request(_httpServer)
                .post('/auth/login')
                .set('user-agent', 'test-agent')
                .send({ ...loginDto, password: 'qwerty' })

            expect(status).toBe(HttpStatus.UNAUTHORIZED)
            expect(body.errors.length).toBe(1)
            expect(body.resultCode).toBe(1)
        })

        it('login user incorrect email', async () => {
            const { status, body } = await request(_httpServer)
                .post('/auth/login')
                .set('user-agent', 'test-agent')
                .send({ ...loginDto, email: 'fail@gmail.com' })

            expect(status).toBe(HttpStatus.UNAUTHORIZED)
            expect(body.errors.length).toBe(1)
            expect(body.resultCode).toBe(1)
        })
    })

    describe('send recovery code', () => {
        it('send recovery code is success', async () => {
            const user = await testSeeder.createUser(testSeeder.getUserDto())

            const { status, body } = await request(_httpServer)
                .post('/auth/password-recovery-email')
                .send({ email: user.email })

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(0)

            const findedUser = await manager.findOneBy(UserEntity, { id: user.id })
            expect(findedUser.passwordRecoveryCode).not.toBe(null)
        })

        it('send recovery code is falied user not found', async () => {
            const { status, body } = await request(_httpServer)
                .post('/auth/password-recovery-email')
                .send({ email: 'fail@gmail.com' })

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(1)
        })
    })

    describe('change password', () => {
        it('change password is success', async () => {
            const userDto = testSeeder.getUserDto()
            const user = await testSeeder.createUser(userDto, { resetPasswordCode: '123' })

            const changePasswordDto: ResetUserPasswordCommand = {
                code: user.passwordRecoveryCode,
                password: 'passwo$.'
            }

            const { status, body } = await request(_httpServer)
                .post('/auth/change-password')
                .send(changePasswordDto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(0)

            const findedUser = await manager.findOneBy(UserEntity, { id: user.id })
            expect(findedUser.passwordHash).not.toBe(user.passwordHash)
            expect(findedUser.passwordSalt).not.toBe(user.passwordSalt)
            expect(findedUser.passwordRecoveryCode).toBe(null)
        })

        it('change password is failed user not found', async () => {
            const changePasswordDto: ResetUserPasswordCommand = {
                code: '123',
                password: 'passwo$.'
            }

            const { status, body } = await request(_httpServer)
                .post('/auth/change-password')
                .send(changePasswordDto)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(1)
        })
    })

    describe('logout', () => {
        let accessToken: string
        let userDto: CreateUserCommand;
        let userEntity: UserEntity;
        let device: DeviceEntity;

        beforeEach(async () => {
            userDto = testSeeder.getUserDto()
            userEntity = await testSeeder.createUser(userDto)

            const loginDto = {
                email: userDto.email,
                password: userDto.password
            }

            const { body, headers } = await request(_httpServer)
                .post('/auth/login')
                .set('user-agent', 'test-agent')
                .send(loginDto)

            accessToken = body.data.accessToken

            const devices = await manager.find(DeviceEntity, { relations: { user: true } })
            device = devices[0]

        })

        it('logout user is success', async () => {
            const { status, body } = await request(_httpServer)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)

            expect(status).toBe(HttpStatus.CREATED)
            expect(body.errors.length).toBe(0)

            const findedDevice = await manager.findOneBy(DeviceEntity, { id: device.id })
            expect(findedDevice).toBe(null)

            const findedUserWithDevices = await manager.findOne(UserEntity, {
                where: { id: userEntity.id },
                relations: { devices: true }
            })

            expect(findedUserWithDevices.devices.length).toBe(0)
        })
    })

    describe('refresh-token', () => {
        let accessToken: string
        let userDto: CreateUserCommand;
        let userEntity: UserEntity;
        let device: DeviceEntity;
        let refreshToken: string;

        beforeEach(async () => {
            userDto = testSeeder.getUserDto()
            userEntity = await testSeeder.createUser(userDto)

            const loginDto = {
                email: userDto.email,
                password: userDto.password
            }

            const { body, headers } = await request(_httpServer)
                .post('/auth/login')
                .set('user-agent', 'test-agent')
                .send(loginDto)

            accessToken = body.data.accessToken
            refreshToken = headers['set-cookie'][0]

            const devices = await manager.find(DeviceEntity, { relations: { user: true } })
            device = devices[0]

        })

        it('create new tokens is success', async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const { status, body, headers } = await request(_httpServer)
                .get('/auth/refresh-token')
                .set('Cookie', `refreshToken=${refreshToken}`)

            console.log(headers['set-cookie'][0])
            expect(status).toBe(HttpStatus.CREATED)
            expect(body.data?.accessToken).not.toBe(accessToken)
            expect(headers['set-cookie'][0]).not.toBe(refreshToken)
        })
    })
})