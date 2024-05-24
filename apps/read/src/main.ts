import { config } from 'dotenv'
config()
import { NestFactory } from '@nestjs/core';
import { ReadModule } from './read.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReadModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:8080',
      'https://incubator-icta-trainee.uk/',
      'https://read.incubator-icta-trainee.uk',
      'https://files.incubator-icta-trainee.uk'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', 'https://incubator-icta-trainee.uk, http://localhost:3000, http://localhost:3001, http://localhost:5173, http://localhost:8080, https://read.incubator-icta-trainee.uk, https://files.incubator-icta-trainee.uk');
  //   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   next();
  // });

  app.use(cookieParser())

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors: ValidationError[]) => {
      const errorsMessages = errors.map(e => {
        let message = null;

        if (e.constraints && Object.keys(e.constraints).length) {
          message = e.constraints[Object.keys(e.constraints)[0]]
        }

        return {
          field: e.property,
          message
        }
      })

      throw new BadRequestException(errorsMessages)
    }
  }));

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/documentation', app, document);

  const MODE = process.env.MODE || 'production';
  const PORT = process.env.PORT || 3002;

  console.log(`Server listen on ${PORT} port in ${MODE} mode.`);

  await app.listen(PORT);
}
bootstrap();
