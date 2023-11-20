import {
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '@app/common/utils/editFileName';
import { JwtAuthGuard } from '@app/auth';
import { FullUserEntity } from '@app/main/user/entity/full-user.entity';
import { ErrorResponseEntity } from '@app/main/auth/entity/error-response.entity';
import { UserProfileViewEntity } from '@app/main/user/entity/user-profile-view-entity';

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
    type: FullUserEntity,
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

  // TODO: move upload avatar or to separate action, or to separate controller
  @ApiOperation({ summary: 'upload file, image/jpeg' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Forbidden.' })
  @ApiResponse({
    type: ErrorResponseEntity,
    status: 500,
  })
  @ApiResponse({
    type: UserProfileViewEntity,
    status: HttpStatus.OK,
  })
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
