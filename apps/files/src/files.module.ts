import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResultInterceptor } from '@libs/interceptor/custom-result.interceptor';
import { PostModule } from './modules/post/post.module';
import { PostgresModule } from '@libs/infra/postgres.module';

@Module({
  imports: [
    PostgresModule,
    UserModule,
    PostModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResultInterceptor
    },

  ],
})
export class FilesModule { }
