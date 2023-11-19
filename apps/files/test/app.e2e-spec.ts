import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FilesModule } from '../src/files.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

describe('FilesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DB_URL =
      'postgres://springfield.3298:VRirOjE9BfN2@ep-twilight-wave-02964973.eu-central-1.aws.neon.tech/neondb';

    process.env.AWS_S3_ACCESS_KEY = 'AWS_S3_ACCESS_KEY';
    process.env.AWS_S3_SECRET_ACCESS_KEY = 'AWS_S3_SECRET_ACCESS_KEY';
    process.env.AWS_S3_REGION = 'AWS_S3_REGION';
    process.env.AWS_S3_BUCKET_NAME = 'AWS_S3_BUCKET_NAME';
    process.env.FILES_SERVICE_PORT = '3161';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), FilesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/files')
      .expect(200)
      .expect('THIS_IS_FILES!!!');
  });
  afterAll(() => {
    app.close();
  });
});
