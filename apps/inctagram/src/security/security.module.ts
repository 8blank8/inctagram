import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@app/db';
import { ConfigModule } from '@nestjs/config';

import { SecurityController } from './api/security.controller';
import { SecurityService } from './application/security.service';
import { SecurityQueryRepository } from './repository/secutity.query.repository';
import { SecurityRepository } from './repository/security.repository';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule,
  ],
  controllers:[SecurityController],
  providers: [
    SecurityQueryRepository,
    SecurityService,
    SecurityRepository,
    PrismaService,
  ],
  exports: [
    SecurityQueryRepository,
    SecurityRepository
  ],
})
export class SecurityModule {}
