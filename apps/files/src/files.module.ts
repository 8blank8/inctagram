import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UserModule } from './modules/user/user.module';
import { primaryPostgresConnectionOptions } from '@libs/infra/postgres-ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResultInterceptor } from '@libs/interceptor/custom-result.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot(primaryPostgresConnectionOptions),
    UserModule,
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResultInterceptor
    },

  ],
})
export class FilesModule { }
