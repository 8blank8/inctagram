import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { PrismaService } from './prisma.service';
import { FilesController } from '../../files/src/files.controller';
import { FilesService } from '../../files/src/files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'FILE_SERVICE',
        transport: Transport.TCP,
        options: {
          host:
            process.env.FILES_SERVICE_HOST ||
            'backend-files-microservice-service',
          port: Number(process.env.FILES_SERVICE_PORT || '3161'),
        },
      },
    ]),
  ],
  controllers: [AppController, FilesController],
  providers: [
    AppService,
    UserService,
    PostService,
    PrismaService,
    FilesService,
  ],
})
export class AppModule {}
