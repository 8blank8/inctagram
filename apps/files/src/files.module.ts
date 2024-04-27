import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { primaryPostgresConnectionOptions } from '@libs/infra/postgres-ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomResultInterceptor } from '@libs/interceptor/custom-result.interceptor';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(primaryPostgresConnectionOptions),
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
