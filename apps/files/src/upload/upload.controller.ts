import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UploadService } from './upload.service';
import { User } from '@prisma/client';
import { FolderType } from './repository/files.repository';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @MessagePattern({ cmd: 'UPLOAD_FILE' })
  async uploadFile(data: {
    user: User;
    file: Express.Multer.File;
    prefix?: FolderType;
  }): Promise<any> {
    const { file, user, prefix } = data;
    try {
      //inctagram-trainee.s3.eu-central-1.amazonaws.com/avatars/300px-Scared_Hamster.jpg
      const uploadedImage = await this.uploadService.uploadFile({
        filePath: file.path,
        fileName: file.filename,
        authorId: user.id,
        mimetype: file.mimetype,
        prefix: prefix ?? 'avatar',
      });

      return { statusCode: 200, isSuccess: true, data: uploadedImage };
    } catch (err) {
      console.log('[SERVER ERROR][UploadToS3Controller]: ', err);
      return { statusCode: 500, isSuccess: false, error: err.message };
    }
  }
}
