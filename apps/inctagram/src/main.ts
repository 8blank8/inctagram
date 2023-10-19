import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adding global prefix
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/documentation', app, document);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`Server mail inctagram running on port ==>  ${PORT}`);
}
bootstrap();
