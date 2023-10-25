import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { FilesModule } from './files.module';

async function bootstrap() {
  const MODE = process.env.MODE || 'production';
  const HOST = MODE === 'DEVELOPMENT' ? 'localhost' : '0.0.0.0';
  const PORT = Number(process.env.FILES_SERVICE_PORT || 3161);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FilesModule,
    {
      transport: Transport.TCP,
      options: {
        host: HOST,
        port: PORT,
      },
    }
  );

  console.log(`App listen on ${HOST}:${PORT} in ${MODE} mode.`);
  await app.listen();
}

bootstrap();
