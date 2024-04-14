import { config } from 'dotenv'
config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.setGlobalPrefix('v1/api');

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api/documentation', app, document);

  const MODE = process.env.MODE || 'production';
  const PORT = process.env.PORT || 3000;

  console.log(`Server listen on ${PORT} port in ${MODE} mode.`);

  await app.listen(PORT);
}
bootstrap();




// app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: false }));

