import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearTestDB } from '../../../../../../libs/tests/clear-db';
import { createTestingModule } from '../../../../../../libs/tests/create-testing-module';
import * as request from 'supertest';
import { TestSeeder } from '../../../../../../libs/tests/test-seeder';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from '../../dto/login.dto';

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
    await clearTestDB();
  });

  afterAll(async () => {
    await _app.close();
    await prisma.$disconnect();
  });

  // describe('registration', () => {
  //     it('registration user success', async () => {
  //         const userDto = testSeeder.getUser()

  //         const { status } = await request(_httpServer)
  //             .post('/auth/registration')
  //             .send(userDto)

  //         expect(status).toBe(HttpStatus.CREATED)
  //     })

  //     it('registration user username is small', async () => {
  //         const userDto = testSeeder.getUser()

  //         const { status } = await request(_httpServer)
  //             .post('/auth/registration')
  //             .send({
  //                 ...userDto,
  //                 username: 'u1-'
  //             })

  //         expect(status).toBe(HttpStatus.BAD_REQUEST)
  //     })

  //     it('registration user username is long', async () => {
  //         const userDto = testSeeder.getUser()

  //         const { status } = await request(_httpServer)
  //             .post('/auth/registration')
  //             .send({
  //                 ...userDto,
  //                 username: "it1-ajksajndkansddsnkjnfskndkfsndkjfnksdnfkjsnkdjnfksdnknjdkfns"
  //             })

  //         expect(status).toBe(HttpStatus.BAD_REQUEST)
  //     })

  //     it('registration user username is incorrect', async () => {
  //         const userDto = testSeeder.getUser()

  //         const { status, body } = await request(_httpServer)
  //             .post('/auth/registration')
  //             .send({
  //                 ...userDto,
  //                 username: "username.$"
  //             })

  //         console.log(body)
  //         expect(status).toBe(HttpStatus.BAD_REQUEST)
  //     })

  //     it('registration user email is incorrect', async () => {
  //         const userDto = testSeeder.getUser()

  //         const { status } = await request(_httpServer)
  //             .post('/auth/registration')
  //             .send({
  //                 ...userDto,
  //                 email: 'email.gmail.com'
  //             })

  //         expect(status).toBe(HttpStatus.BAD_REQUEST)
  //     })
  // })

  describe('login', () => {
    it('login user is success', async () => {
      const user = await testSeeder.createUser(testSeeder.getUser());

      const loginDto: LoginDto = {
        email: user.email,
        password: user.password,
      };

      const { status, body } = await request(_httpServer)
        .post('/auth/login')
        .set({ 'user-agent': 'testing' })
        .send(loginDto);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
});
