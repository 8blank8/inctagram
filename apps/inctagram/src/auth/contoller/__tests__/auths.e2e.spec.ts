import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearTestDB } from '../../../../../../libs/tests/clear-db';
import { createTestingModule } from '../../../../../../libs/tests/create-testing-module';
import * as request from 'supertest';
import { TestSeeder } from '../../../../../../libs/tests/test-seeder';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from '../../dto/login.dto';
import { FullUserEntity } from '@app/main/user/entity/full-user.entity';

describe('auth e2e', () => {
  let _app: INestApplication;
  let _httpServer;

  let testSeeder: TestSeeder;
  let prisma: PrismaClient;

  beforeAll(async () => {
    ({ app: _app, httpServer: _httpServer } = await createTestingModule());

    prisma = new PrismaClient();

    testSeeder = new TestSeeder(prisma);
    await _app.init();
  }, 10000);

  beforeEach(async () => {
    await clearTestDB(prisma);
  });

  afterAll(async () => {
    await _app.close();
    await prisma.$disconnect();
  });

  describe('registration', () => {
    it('registration user success', async () => {
      const userDto = testSeeder.getUser()

      const { status } = await request(_httpServer)
        .post('/auth/registration')
        .send(userDto)

      expect(status).toBe(HttpStatus.CREATED)
    })

    it('registration user username is small', async () => {
      const userDto = testSeeder.getUser()

      const { status } = await request(_httpServer)
        .post('/auth/registration')
        .send({
          ...userDto,
          username: 'u1-'
        })

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('registration user username is long', async () => {
      const userDto = testSeeder.getUser()

      const { status } = await request(_httpServer)
        .post('/auth/registration')
        .send({
          ...userDto,
          username: "it1-ajksajndkansddsnkjnfskndkfsndkjfnksdnfkjsnkdjnfksdnknjdkfns"
        })

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('registration user username is incorrect', async () => {
      const userDto = testSeeder.getUser()

      const { status } = await request(_httpServer)
        .post('/auth/registration')
        .send({
          ...userDto,
          username: "username.$"
        })

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('registration user email is incorrect', async () => {
      const userDto = testSeeder.getUser()

      const { status } = await request(_httpServer)
        .post('/auth/registration')
        .send({
          ...userDto,
          email: 'email.gmail.com'
        })

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })
  })

  describe('login', () => {
    it('login user is success', async () => {
      const userDto = testSeeder.getUser()
      const user = await testSeeder.createUser(userDto);

      const loginDto: LoginDto = {
        email: userDto.email,
        password: userDto.password,
      };

      const { status, body, headers } = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      expect(headers['set-cookie'].length).toBe(1)
      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        accessToken: expect.any(String),
      });

      const findedDevice = await prisma.device.findFirst({
        where: {
          title: 'testing'
        }
      })

      expect(findedDevice.userId).toBe(user.id)
    });

    it('login user is incorrect password', async () => {
      const userDto = testSeeder.getUser()
      await testSeeder.createUser(userDto);

      const loginDto: LoginDto = {
        email: userDto.email,
        password: 'password1.',
      };

      const { status } = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('login user is incorrect email', async () => {
      const userDto = testSeeder.getUser()
      await testSeeder.createUser(userDto);

      const loginDto: LoginDto = {
        email: 'incorrect@gmail.com',
        password: userDto.password,
      };

      const { status } = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('logout', () => {
    it('logout user success', async () => {
      const userDto = testSeeder.getUser()
      await testSeeder.createUser(userDto);

      const loginDto: LoginDto = {
        email: userDto.email,
        password: userDto.password,
      };

      const token = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      const { status } = await request(_httpServer)
        .get('/auth/logout')
        .set({ 'Authorization': `Bearer ${token.body.accessToken}` })

      expect(status).toBe(HttpStatus.OK)

      const findedDevice = await prisma.device.findFirst({
        where: {
          title: 'testing'
        }
      })

      expect(findedDevice).toBe(null)
    })

    it('logout user is unauthorized', async () => {
      const userDto = testSeeder.getUser()
      await testSeeder.createUser(userDto);

      const loginDto: LoginDto = {
        email: userDto.email,
        password: userDto.password,
      };

      await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      const { status } = await request(_httpServer)
        .get('/auth/logout')

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })
  })

  describe('me', () => {
    it('get me is success', async () => {
      const userDto = testSeeder.getUser()
      const createdUser = await testSeeder.createUser(userDto);

      const loginDto: LoginDto = {
        email: userDto.email,
        password: userDto.password,
      };

      const token = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      const { status, body } = await request(_httpServer)
        .get('/auth/me')
        .set({ 'Authorization': `Bearer ${token.body.accessToken}` })

      const userData: FullUserEntity = body

      expect(status).toBe(HttpStatus.OK)
      expect(userData.email).toBe(createdUser.email)
      expect(userData.emailConfirmed).toBe(createdUser.emailConfirmed)
      expect(userData.id).toBe(createdUser.id)
      expect(userData.createdAt).toBe(createdUser.createdAt.toISOString())
    })


    it('get me is unathorized', async () => {
      const userDto = testSeeder.getUser()
      await testSeeder.createUser(userDto);

      const { status } = await request(_httpServer)
        .get('/auth/me')
        .set({ 'Authorization': `Bearer asdasd` })


      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })
  })

  describe('refresh-token', () => {
    it('refresh token is success', async () => {
      const userDto = testSeeder.getUser()
      await testSeeder.createUser(userDto)


      const loginDto: LoginDto = {
        email: userDto.email,
        password: userDto.password,
      };

      const { body, headers } = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      const refreshToken = headers['set-cookie'][0]

      await new Promise(resolve => setTimeout(resolve, 1000))

      const res = await request(_httpServer)
        .get('/auth/refresh-token')
        .set({ 'Cookie': [refreshToken] })

      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body).toEqual({
        accessToken: expect.any(String)
      })

      expect(res.body.accessToken).not.toBe(body.accessToken)
      expect(res.headers['set-cookie'][0]).not.toBe(refreshToken)
    })
  })
});
