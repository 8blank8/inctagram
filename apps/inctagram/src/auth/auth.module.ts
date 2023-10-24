import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateRefreshTokenUseCase } from './use_cases/create.refresh.token.use.case';
import { LoginUserUseCase } from './use_cases/login.user.use.case';
import { ValidateUserUseCase } from './use_cases/validate.user.use.case';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    CqrsModule,
    SecurityModule,
    UserModule
  ],
  controllers:[AuthController],
  providers: [
    AuthService, 
    PrismaService,
    CreateRefreshTokenUseCase,
    LoginUserUseCase,
    ValidateUserUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
