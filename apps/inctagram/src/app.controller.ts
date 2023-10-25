import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Inject,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { Post as PostModel } from '@prisma/client';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from '@app/main/user/entity/user.entity';

@Controller()
export class AppController {
  constructor(
    @Inject('FILE_SERVICE') private client: ClientProxy,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private appService: AppService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserEntity,
    isArray: true,
  })
  @Get('users')
  getUsers(@Param() queryParam) {
    return this.userService.users(queryParam);
  }

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: id });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('files')
  async getFiles(): Promise<any> {
    return this.client.send({ cmd: 'YOUR_PATTERN' }, {}).toPromise();
  }

  @Get('filtered-posts/:searchString')
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

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: id });
  }
}
