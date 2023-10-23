import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getTestUser } from './utils/get.test.user';
import { startTestConfig } from './utils/start.app';
describe('AuthService', () => {
  let app: INestApplication;

  const user1 = getTestUser(1);
  const user2 = getTestUser(2);
  const createdUsersConfirmationCode = {};

  beforeAll(async () => {
    app = await startTestConfig();
  });

  describe('delete all data', () => {
    it('DELETE /testing/delete-all delete all data', async () => {
      await request(app.getHttpServer())
        .delete(`/testing/delete-all`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('POST /auth/registration', () => {
    it('should be status 400 blank email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, email: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "   " email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, email: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 incorrect email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, email: 'example1mail.ru' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 firstname length 1', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, firstName: 'a' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "    " firstname', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, firstName: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "    " lastname', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, lastName: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 lastName length 1', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, lastName: 'a' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 password length 1', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, password: 'a' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "    " password', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send({ ...user1, password: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 201 correct registration data', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send(user1)
        .expect(HttpStatus.CREATED)
        .then((item) => {
          expect(item.body).toEqual({
            userId: expect.any(String),
          });
        });
    });

    it('should be status 400 user email exist', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send(user1)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /auth/confirmation-code', () => {
    it('should be status 400 "     " code', async () => {
      await request(app.getHttpServer())
        .post(`/auth/confirmation-code`)
        .send({ code: '     ', email: user1.email })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 confirmation data not found', async () => {
      await request(app.getHttpServer())
        .post(`/auth/confirmation-code`)
        .send({ code: '12345321', email: user1.email })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 204 confirmed', async () => {
      await request(app.getHttpServer())
        .post(`/auth/confirmation-code`)
        .send({
          code: createdUsersConfirmationCode[user1.email],
          email: user1.email,
        })
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should be status 400 user is confirmed', async () => {
      await request(app.getHttpServer())
        .post(`/auth/confirmation-code`)
        .send({
          code: createdUsersConfirmationCode[user1.email],
          email: user1.email,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /auth/resend-confirmation-code', () => {
    it('should be status 400 user is confirmed', async () => {
      await request(app.getHttpServer())
        .post(`/auth/resend-confirmation-code`)
        .send({ email: user1.email });
      expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 201 correct registration data', async () => {
      await request(app.getHttpServer())
        .post(`/auth/registration`)
        .send(user2)
        .expect(HttpStatus.CREATED)
        .then((item) => {
          expect(item.body).toEqual({
            userId: expect.any(String),
          });
        });
    });

    it('should be status 400 blank email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/resend-confirmation-code`)
        .send({ email: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "   " email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/resend-confirmation-code`)
        .send({ email: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 incorrect email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/resend-confirmation-code`)
        .send({ email: 'example1mail.ru' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 204 code send in email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/resend-confirmation-code`)
        .send({ email: user2.email })
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should be status 204 confirmed', async () => {
      await request(app.getHttpServer())
        .post(`/auth/confirmation-code`)
        .send({
          code: createdUsersConfirmationCode[user2.email],
          email: user2.email,
        })
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should be status 400 blank email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/send-code-reset-password`)
        .send({ email: '' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 "   " email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/send-code-reset-password`)
        .send({ email: '     ' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 incorrect email', async () => {
      await request(app.getHttpServer())
        .post(`/auth/send-code-reset-password`)
        .send({ email: 'example1mail.ru' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 400 user not found', async () => {
      await request(app.getHttpServer())
        .post(`/auth/send-code-reset-password`)
        .send({ email: 'a1asds@mail.ru' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should be status 204 send code in email', async () => {
      console.log(user1.email);
      await request(app.getHttpServer())
        .post(`/auth/send-code-reset-password`)
        .send({ email: user1.email })
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  afterAll(() => {
    app.close();
  });
});
