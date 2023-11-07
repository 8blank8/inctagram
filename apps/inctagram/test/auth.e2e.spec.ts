import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { testUsers } from './utils/test.users.ustil';
import { mockMailCodes, startTestConfig } from './utils/start.app';
import * as querystring from 'querystring';

describe('AuthService', () => {
  let app: INestApplication;
  let server;

  const [user1] = testUsers;
  let user1Token = null;
  console.log(user1Token);

  beforeAll(async () => {
    app = await startTestConfig();
    server = app.getHttpServer();
  });

  describe('POST /auth/registration', () => {
    it('should be status 400 blank email', async () => {
      await request(server)
        .post(`/auth/registration`)
        .send({ ...user1, email: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 blank email', async () => {
      await request(server)
        .post(`/auth/registration`)
        .send({ ...user1, email: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "   " email', async () => {
      await request(server)
        .post(`/auth/registration`)
        .send({ ...user1, email: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 incorrect email', async () => {
      await request(server)
        .post(`/auth/registration`)
        .send({ ...user1, email: 'example1mail.ru' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 password length 1', async () => {
      await request(server)
        .post(`/auth/registration`)
        .send({ ...user1, password: 'a' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "    " password', async () => {
      await request(server)
        .post(`/auth/registration`)
        .send({ ...user1, password: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 201 correct registration data', async () => {
      await request(server)
        .post(`/auth/registration`)
        .set('user-agent', 'test-user-agent')
        .send(user1)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(mockMailCodes[user1.email]).toBeDefined();
          expect(res.body).toEqual({
            userId: expect.any(String),
          });
        });
    });

    it('should overwrite data if user email exist', async () => {
      await request(server)
        .post(`/auth/registration`)
        .set('user-agent', 'test-user-agent')
        .send(user1)
        .expect(HttpStatus.CREATED);
    });

    describe('POST /auth/confirm-code', () => {
      it('should be status 400 "     " code', async () => {
        const data = querystring.parse(mockMailCodes[user1.email]);
        await request(app.getHttpServer())
          .post(`/auth/confirm-code`)
          .send(data)
          .expect(HttpStatus.OK);
      });
    });

    it('should be status 400 user email exist', async () => {
      await request(server)
        .post(`/auth/registration`)
        .set('user-agent', 'test-user-agent')
        .send(user1)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should login with right data', async () => {
      await request(server)
        .post(`/auth/login`)
        .set('user-agent', 'test-user-agent')
        .send({ email: user1.email, password: user1.password })
        .expect(HttpStatus.OK)
        .then((res) => {
          user1Token = res.body?.token?.accessToken || '';
          expect(res.body).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          });
        });
    });

    //   it('should be status 400 confirmation data not found', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/confirmation-code`)
    //       .send({ code: '12345321', email: user1.email })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 204 confirmed', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/confirmation-code`)
    //       .send({
    //         code: createdUsersConfirmationCode[user1.email],
    //         email: user1.email,
    //       })
    //       .expect(HttpStatus.NO_CONTENT);
    //   });

    //   it('should be status 400 user is confirmed', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/confirmation-code`)
    //       .send({
    //         code: createdUsersConfirmationCode[user1.email],
    //         email: user1.email,
    //       })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });
    // });

    // describe('POST /auth/resend-confirmation-code', () => {
    //   it('should be status 400 user is confirmed', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/resend-confirmation-code`)
    //       .send({ email: user1.email });
    //     expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 201 correct registration data', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/registration`)
    //       .send(user2)
    //       .expect(HttpStatus.CREATED)
    //       .then((item) => {
    //         expect(item.body).toEqual({
    //           userId: expect.any(String),
    //         });
    //       });
    //   });

    //   it('should be status 400 blank email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/resend-confirmation-code`)
    //       .send({ email: '' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 400 "   " email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/resend-confirmation-code`)
    //       .send({ email: '     ' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 400 incorrect email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/resend-confirmation-code`)
    //       .send({ email: 'example1mail.ru' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 204 code send in email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/resend-confirmation-code`)
    //       .send({ email: user2.email })
    //       .expect(HttpStatus.NO_CONTENT);
    //   });

    //   it('should be status 204 confirmed', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/confirmation-code`)
    //       .send({
    //         code: createdUsersConfirmationCode[user2.email],
    //         email: user2.email,
    //       })
    //       .expect(HttpStatus.NO_CONTENT);
    //   });
    // });

    // describe('POST /auth/reset-password', () => {
    //   it('should be status 400 blank email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/send-code-reset-password`)
    //       .send({ email: '' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 400 "   " email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/send-code-reset-password`)
    //       .send({ email: '     ' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 400 incorrect email', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/send-code-reset-password`)
    //       .send({ email: 'example1mail.ru' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 400 user not found', async () => {
    //     await request(app.getHttpServer())
    //       .post(`/auth/send-code-reset-password`)
    //       .send({ email: 'a1asds@mail.ru' })
    //       .expect(HttpStatus.BAD_REQUEST);
    //   });

    //   it('should be status 204 send code in email', async () => {
    //     console.log(user1.email);
    //     await request(app.getHttpServer())
    //       .post(`/auth/send-code-reset-password`)
    //       .send({ email: user1.email })
    //       .expect(HttpStatus.NO_CONTENT);
    //   });
    // });

    afterAll(async () => {
      app.close();
    });
  });
});
