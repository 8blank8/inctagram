import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';

import { LocalStrategy, GoogleStrategy, JwtStrategy } from '@app/auth';
import { FilesController } from '../../files/src/files.controller';
import { FilesService } from '../../files/src/files.service';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './security/security.module';
import { UserModule } from './user/user.module';
import { MailService } from '@app/common';
import { GithubStrategy } from '@app/auth/strategies/github.strategy';

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
    MailerModule.forRoot({
      transport: {
        host:
          process.env.EMAIL_HOST ||
          // settings_env.EMAIL_HOST ||
          'smtp.office365.com',
        port: Number(process.env.EMAIL_PORT),
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ID, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      },
      defaults: {
        from: process.env.EMAIL_ID,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
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
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    MailService,
    GithubStrategy,
  ],
})
export class AppModule {}
