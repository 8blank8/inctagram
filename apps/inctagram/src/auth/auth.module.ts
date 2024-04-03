import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { MailService } from '@app/common';

import { AuthService } from './auth.service';
import { AuthController } from './contoller/auth.controller';
import { AuthorizeUserUseCase } from './use_cases/login/authorize-user.use-case';
import { ValidateUserUseCase } from './use_cases/login/validate.user.use.case';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';
import { CreateDeviceUseCase } from '../security/use_cases/create/create.device.use.case';
import { RegisterGithubUserUseCase } from './use_cases/github/register-github-user.use-case';
import { RegisterGoogleUserUseCase } from './use_cases/google/register-google-user.use-case';
import { LogOutUserUseCase } from './use_cases/logout/log-out.use-case';
import { DeleteDeviceUseCase } from '../security/use_cases/delete/delete-device.use-case';
import { EmailConfirmationUseCase } from '../user/use_cases/email/email-confirmation.use-case';
import { ResendConfirmationCodeUseCase } from '../user/use_cases/email/resend-confirmation-code.use-case';
import { PasswordResetMailUseCase } from '../user/use_cases/password/password-reset-email.use-case';
import { ResetUserPasswordUseCase } from '../user/use_cases/password/reset-user-password.use-case';
import { CreateUserUseCase } from '../user/use_cases/registration/create-user.use-case';

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
    EmailConfirmationUseCase,
    ResendConfirmationCodeUseCase,
    PasswordResetMailUseCase,
    ResetUserPasswordUseCase,
    CreateUserUseCase,
  ],
  exports: [AuthService, ValidateUserUseCase],
})
export class AuthModule {}
