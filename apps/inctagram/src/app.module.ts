import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AppController } from '@app/main/app.controller';
import { AppService } from '@app/main/app.service';
import { UserService } from '@app/main/user/user.service';
import { GoogleStrategy, JwtStrategy, LocalStrategy } from '@app/auth';
import { AuthModule } from '@app/main/auth/auth.module';
import { SecurityModule } from '@app/main/security/security.module';
import { UserModule } from '@app/main/user/user.module';
import { MailService } from '@app/common';
import { GithubStrategy } from '@app/auth/strategies/github.strategy';
import { RefreshTokenStrategy } from '@app/auth/strategies/refresh-jwt.strategy';
import { PostModule } from '@app/main/post/post.module';
import { PostService } from '@app/main/post/post.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
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
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PostService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    MailService,
    GithubStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
