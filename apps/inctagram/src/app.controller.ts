import {
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from '@app/main/user/entity/user-entity';

import { AppService } from './app.service';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '@app/common/utils/editFileName';
import { JwtAuthGuard } from '@app/auth';

@Controller()
export class AppController {
  constructor(
    @Inject('FILE_SERVICE') private client: ClientProxy,
    private readonly userQueryRepository: UserQueryRepository,
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
    return this.userQueryRepository.findAllUsers(queryParam);
  }

  @Get('files')
  async getFiles(): Promise<any> {
    return this.client.send({ cmd: 'YOUR_PATTERN' }, {}).toPromise();
  }

  @ApiOperation({ summary: 'upload file' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 20 },
      storage: diskStorage({
        destination: './dist/files',
        filename: editFileName,
      }),
    }),
  )
  @Post('upload-avatar')
  async uploadFile(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    return this.client
      .send({ cmd: 'UPLOAD_FILE' }, { file, user: req.user })
      .toPromise();
  }
}
