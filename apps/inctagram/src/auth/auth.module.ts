import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthorizeUserUseCase } from './use_cases/authorizeUserUseCase';
import { ValidateUserUseCase } from './use_cases/validate.user.use.case';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';
import { CreateDeviceUseCase } from '@app/main/security/application/use_cases/create.device.use.case';
import { MailModule, MailService } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    CqrsModule,
    SecurityModule,
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    AuthorizeUserUseCase,
    CreateDeviceUseCase,
    ValidateUserUseCase,
    MailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
