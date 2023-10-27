import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { UserQueryRepository } from './repository/user.query.repository';
import { UserRepository } from './repository/user.repository';
import { CreateUserUseCase } from './use_cases/create.user.use.case';
import { DeleteUserUseCase } from './use_cases/delete.user.use.case';
import { ResendConfirmationCodeUseCase } from './use_cases/resendConfirmationCodeUseCase';
import { EmailConfirmationUseCase } from './use_cases/email.confirmation.use.case';
import { MailService } from '@app/common';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({}), CqrsModule],
  controllers: [],
  providers: [
    PrismaService,
    UserQueryRepository,
    UserRepository,
    CreateUserUseCase,
    DeleteUserUseCase,
    ResendConfirmationCodeUseCase,
    EmailConfirmationUseCase,
    MailService,
  ],
  exports: [UserQueryRepository, UserRepository],
})
export class UserModule {}
