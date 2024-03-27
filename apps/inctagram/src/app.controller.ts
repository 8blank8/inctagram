import {
  Body,
  Controller,
  Delete,
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
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '@app/auth';
import { FullUserEntity } from '@app/main/user/entity/full-user.entity';
import { ErrorResponseEntity } from '@app/main/auth/entity/error-response.entity';
import { UserProfileViewEntity } from '@app/main/user/entity/user-profile-view.entity';
import { OkApiResponse } from 'libs/swagger/swagger.decorator';

@Controller()
export class AppController {
  constructor(
    @Inject('FILE_SERVICE') private client: ClientProxy,
    private readonly userQueryRepository: UserQueryRepository,
    private appService: AppService,
  ) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @OkApiResponse(FullUserEntity, 'The found record', true)
  @Get('users')
  getUsers(@Param() queryParam) {
    return this.userQueryRepository.findAllUsers(queryParam);
  }

  // TODO: move upload avatar or to separate action, or to separate controller
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
        cropProps: {
          type: 'string',
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
      storage: memoryStorage(),
    }),
  )
  @Post('avatar/upload')
  async uploadFile(
    @Req() req,
    @Body() body,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    return this.client
      .send(
        { cmd: 'UPLOAD_FILE' },
        { file, user: req.user, cropProps: body.cropProps },
      )
      .toPromise();
  }


  @ApiOperation({ summary: 'delete profile avatar file' })
  @ApiResponse({ status: 401, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @UseGuards(JwtAuthGuard)
  @Delete('avatar/:id')
  async deleteAvatarFile(@Param() params: any) {
    return this.client
      .send({ cmd: 'DELETE_FILE' }, { id: params.id })
      .toPromise();
  }
}
