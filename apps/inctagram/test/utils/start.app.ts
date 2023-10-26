import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../../src/app.module';
import * as process from 'process';
import { MailService } from '@app/common';
import { MailerService } from "@nestjs-modules/mailer";


const mockCatsService = {
  sendMail: jest.fn()
};

export const startTestConfig = async () => {
  let app: INestApplication;

  console.log(process.env.DB_URL);
  process.env.DB_URL =
    'postgres://springfield.3298:VRirOjE9BfN2@ep-twilight-wave-02964973.eu-central-1.aws.neon.tech/neondb';

  process.env.FILES_SERVICE_PORT = '3161';

  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule.forRoot(), AppModule],
    providers: [
      {
        provide: MailerService,
        useValue: {
          sendMail: jest.fn(),
        },
      },
    ],
  })
    // .overrideProvider(MailService)
    // .useFactory({
    //   factory: () => {
    //     return {
    //       sendEmailConfirmationMessage: async (email: string, code: string) => {
    //         console.log(email, code);
    //         return true;
    //       },
    //       testMail: (email: string, code: string) => {
    //         console.log(email, code);
    //         return true;
    //       },
    //     };
    //   },
    // })
    .compile();

  // eslint-disable-next-line prefer-const
  app = moduleRef.createNestApplication();
  // app.use(cookieParser())
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
  // app.useGlobalFilters(new HttpExceptionFilter())
  await app.init();

  return app;
};
