import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@app/db';
import { ConfigModule } from '@nestjs/config';

import { SecurityService } from './security.service';
import { SecurityQueryRepository } from './repository/secutity-query.repository';
import { SecurityRepository } from './repository/security.repository';
import { DeleteAllDevicesUseCase } from '@app/main/security/use_cases/delete.all.device.use.case';
import { SecurityController } from './controller/security.controller';

@Module({
  imports: [ConfigModule.forRoot(), CqrsModule],
  controllers: [SecurityController],
  providers: [
    PrismaService,
    SecurityQueryRepository,
    SecurityService,
    SecurityRepository,
    DeleteAllDevicesUseCase,
  ],
  exports: [SecurityQueryRepository, SecurityRepository],
})
export class SecurityModule {}
