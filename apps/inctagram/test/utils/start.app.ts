import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../../src/app.module';

export const startTestConfig = async () => {
  let app: INestApplication;

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    // .overrideProvider(AuthEmailManager)
    // .useValue({
    //   sendRegistrationCode: (email: string, code: string) => {
    //     createdUsersConfirmationCode[email] = code;
    //   },
    //   sendResetPasswordCode: (email: string, code: string) => {
    //     createUsersResetPasswordCode[email] = code;
    //   },
    // })
    .compile();

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
    })
  );
  // app.useGlobalFilters(new HttpExceptionFilter())
  await app.init();

  return app;
};
