import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:8080',
      'https://incubator-icta-trainee.uk/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Adding global prefix
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/documentation', app, document);
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: false }));

  const MODE = process.env.MODE || 'production';
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`Server listen on ${PORT} port in ${MODE} mode.`);
}
bootstrap();
