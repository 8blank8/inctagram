import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { WELCOME_MESSAGE } from '../src/utils/variables';
import { startTestConfig } from './utils/start.app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await startTestConfig();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(WELCOME_MESSAGE);
  });
  it('mock', () => {
    const i = 1;
    expect(i).toBe(1);
  });
  afterAll(() => {
    app.close();
  });
});
