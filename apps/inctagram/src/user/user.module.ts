import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@app/db';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { UserQueryRepository } from './repository/user.query.repository';
import { UserRepository } from './repository/user.repository';
import { CreateUserUseCase } from './use_cases/create.user.use.case';
import { DeleteUserUseCase } from './use_cases/delete.user.use.case';
import { ResendingConfirmationCodeUseCase } from './use_cases/resending.confirmation.code.use.case';
import { EmailConfirmationUseCase } from './use_cases/email.confirmation.use.case';
import { EmailAdapter, EmailManager } from '@app/common';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({}), CqrsModule],
  controllers: [],
  providers: [
    PrismaService,
    // EmailAdapter,
    // EmailManager,
    UserQueryRepository,
    UserRepository,
    CreateUserUseCase,
    DeleteUserUseCase,
    ResendingConfirmationCodeUseCase,
    EmailConfirmationUseCase,
  ],
  exports: [UserQueryRepository, UserRepository],
})
export class UserModule {}
