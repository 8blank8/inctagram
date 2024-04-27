import { Module } from '@nestjs/common';
import { ReadController } from './read.controller';
import { ReadService } from './read.service';
import { DeviceModule } from '../device/device.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { primaryPostgresConnectionOptions } from '@libs/infra/postgres-ormconfig';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResultInterceptor } from '@libs/interceptor/custom-result.interceptor';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(primaryPostgresConnectionOptions),
    DeviceModule,
    PostModule,
    UserModule
  ],
  controllers: [ReadController],
  providers: [
    ReadService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResultInterceptor
    },
  ],
})
export class ReadModule { }
