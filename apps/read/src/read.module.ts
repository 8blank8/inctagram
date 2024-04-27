import { Module } from '@nestjs/common';
import { DeviceModule } from './modules/device/device.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { primaryPostgresConnectionOptions } from '@libs/infra/postgres-ormconfig';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResultInterceptor } from '@libs/interceptor/custom-result.interceptor';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(primaryPostgresConnectionOptions),
    DeviceModule,
    PostModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResultInterceptor
    },
  ],
})
export class ReadModule { }
