import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@app/db';
import { ConfigModule } from '@nestjs/config';

import { SecurityService } from './security.service';
import { SecurityQueryRepository } from './repository/secutity.query.repository';
import { SecurityRepository } from './repository/security.repository';
import { SecurityController } from '@app/main/security/security.controller';

@Module({
  imports: [ConfigModule.forRoot(), CqrsModule],
  controllers: [SecurityController],
  providers: [
    SecurityQueryRepository,
    SecurityService,
    SecurityRepository,
    PrismaService,
  ],
  exports: [SecurityQueryRepository, SecurityRepository],
})
export class SecurityModule {}
