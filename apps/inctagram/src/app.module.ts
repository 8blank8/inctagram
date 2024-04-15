import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
// import { PostgresModule } from '../../../libs/infra/postgres.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { primaryPostgresConnectionOptions } from '../../../libs/infra/postgres-ormconfig';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResultInterceptor } from '../../../libs/interceptor/custom-result.interceptor';
import { MailModule } from '../../../libs/mailer/mailer.module';
import { DeviceModule } from './modules/device/device.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from '@libs/guards/google.guard';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    TypeOrmModule.forRoot(primaryPostgresConnectionOptions),
    PassportModule,
    JwtModule,
    MailModule,
    AuthModule,
    UserModule,
    DeviceModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResultInterceptor
    },
    GoogleStrategy
  ],
})
export class AppModule { }
