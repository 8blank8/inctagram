import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

import { FilesController } from '../../files/src/files.controller';
import { FilesService } from '../../files/src/files.service';
import { LocalStrategy } from '@app/auth';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './security/security.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({}),
    CqrsModule,
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
    AuthModule,
    SecurityModule,
    UserModule,
  ],
  controllers: [AppController, FilesController],
  providers: [
    AppService,
    UserService,
    PostService,
    PrismaService,
    FilesService,
    LocalStrategy,
  ],
})
export class AppModule {}
