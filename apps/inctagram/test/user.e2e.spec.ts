import { HttpStatus, INestApplication } from '@nestjs/common';
import { mockMailCodes, startTestConfig } from './utils/start.app';
import { testUsers } from './utils/test.users.ustil';
import * as request from 'supertest';

describe('User', () => {
  let app: INestApplication;

  const [user2] = testUsers;
  //   let user2Token = null;
  let server;

  beforeAll(async () => {
    app = await startTestConfig();
    server = app.getHttpServer();
  });

  describe('change profile info', () => {
    it('should be status 201 correct registration data', async () => {
      await request(server)
        .post(`/auth/registration`)
        .set('user-agent', 'test-user-agent')
        .send(user2)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(mockMailCodes[user2.email]).toBeDefined();
          expect(res.body).toEqual({
            userId: expect.any(String),
          });
        });
    });

    it('should login with right data', async () => {
      await request(server)
        .post(`/auth/login`)
        .set('user-agent', 'test-user-agent')
        .send({ email: user2.email, password: user2.password })
        .expect(HttpStatus.OK)
        .then((res) => {
          console.log({ token_body: res.body });
          //   user2Token = res.body?.token?.accessToken || '';
          expect(res.body).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          });
        });
    });

    // it('should be status 204 correct inputData', async () => {
    //     console.log({ token: user2Token })
    //     const res = await request(server)
    //         .put('/user/profile')
    //         .set('Authorization', `Bearer ${user2Token}`)
    //         .send({
    //             username: 'user1username',
    //             firstname: 'Biba',
    //             lastname: 'Boba',
    //             dateOfBirth: '12.12.2000',
    //             aboutMe: 'about me info',
    //         });

    //     expect(res.status).toBe(HttpStatus.NO_CONTENT);
    // });

    // it('find my profile after changed', async () => {
    //     const res = await request(server)
    //         .get('/user/profile')
    //         .set('Authorization', `Bearer ${user2Token}`);

    //     expect(res.status).toBe(HttpStatus.OK);
    //     expect(res.body).toEqual({
    //         username: 'user1username',
    //         firstname: 'Biba',
    //         lastname: 'Boba',
    //         dateOfBirth: '12.12.2000',
    //         aboutMe: 'about me info',
    //     });
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
