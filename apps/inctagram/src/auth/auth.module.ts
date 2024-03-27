import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { MailService } from '@app/common';
import { RegisterGoogleUserUseCase } from '@app/main/auth/use_cases/register-google-user.use-case';
import { RegisterGithubUserUseCase } from '@app/main/auth/use_cases/register-github-user.use-case';
import { CreateDeviceUseCase } from '@app/main/security/use_cases/create.device.use.case';

import { AuthService } from './auth.service';
import { AuthController } from './contoller/auth.controller';
import { AuthorizeUserUseCase } from './use_cases/authorize-user.use-case';
import { ValidateUserUseCase } from './use_cases/validate.user.use.case';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';
import { LogOutUserUseCase } from '@app/main/auth/use_cases/log-out.use-case';
import { DeleteDeviceUseCase } from '@app/main/security/use_cases/delete-device.use-case';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    CqrsModule,
    SecurityModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    AuthorizeUserUseCase,
    CreateDeviceUseCase,
    ValidateUserUseCase,
    MailService,
    RegisterGithubUserUseCase,
    RegisterGoogleUserUseCase,
    LogOutUserUseCase,
    DeleteDeviceUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
