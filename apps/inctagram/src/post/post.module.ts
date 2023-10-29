import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { PostService } from '@app/main/post/post.service';
import { PostController } from '@app/main/post/post.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PostController],
  providers: [PrismaService, PostService],
  exports: [PostService],
})
export class PostModule {}
