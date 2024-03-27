import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '@app/main/post/post.service';
import { Post as PostModel } from '.prisma/client';
import { JwtAuthGuard } from '@app/auth';
import { PostEntity } from '@app/main/post/entity/post.entity';
import {
  CreatedApiResponse,
  OkApiResponse,
} from 'libs/swagger/swagger.decorator';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @OkApiResponse(PostEntity, 'post')
  @UseGuards(JwtAuthGuard)
  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: id });
  }

  @OkApiResponse(PostEntity, 'The found records', true)
  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @OkApiResponse(PostEntity, 'The found records', true)
  @UseGuards(JwtAuthGuard)
  @Get('filtered-posts:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @CreatedApiResponse('Created record', PostEntity)
  @UseGuards(JwtAuthGuard)
  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: id },
      data: { published: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: id });
  }
}
