import { MailService } from '@app/common';
import { AppModule } from '@app/main/app.module';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';

export const mockMailCodes = {};

const mockMailService = {
  sendEmailConfirmationMessage: async (email: string, code: string) => {
    console.log('sendEmailConfirmationMessage', email, code);
    mockMailCodes[email] = code;
    return true;
  },
  sendEmailPassRecovery: async (email: string, code: string) => {
    console.log('sendEmailPassRecovery', email, code);
    mockMailCodes[email] = code;
    return true;
  },
  testMail: (email: string, code: string) => {
    console.log('testMail', email, code);
    console.log(email, code);
    return true;
  },
};

export const createTestingModule = async () => {
  process.env.DB_URL =
    process.env.TEST_DB_URL ||
    'postgres://springfield.3298:VRirOjE9BfN2@ep-twilight-wave-02964973.eu-central-1.aws.neon.tech/neondb';

  process.env.AWS_S3_ACCESS_KEY = 'AWS_S3_ACCESS_KEY';
  process.env.AWS_S3_SECRET_ACCESS_KEY = 'AWS_S3_SECRET_ACCESS_KEY';
  process.env.AWS_S3_REGION = 'AWS_S3_REGION';
  process.env.AWS_S3_BUCKET_NAME = 'AWS_S3_BUCKET_NAME';
  process.env.FILES_SERVICE_PORT = '3161';
  process.env.MODE = 'TESTING';

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailService)
    .useValue(mockMailService)
    .overrideProvider(MailerService)
    .useValue({
      sendMail: jest.fn(),
    })
    .compile();

  const app = moduleRef.createNestApplication();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const errorMessages = errors.map(({ property, constraints }) => {
          if (constraints) {
            return {
              message: constraints[Object.keys(constraints)[0]],
              field: property,
            };
          }
        });

        throw new BadRequestException(errorMessages);
      },
    }),
  );

  // eslint-disable-next-line prefer-const
  const httpServer = await app.getHttpServer();

  console.log('app.init() ==> done');
  //   await clearTestDataBase();
  //   console.log('clearTestDataBase ==> done');

  return { app, moduleRef, httpServer };
};
