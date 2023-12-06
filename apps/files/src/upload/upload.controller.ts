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
    file: Express.Multer.File;
    user: User;
    prefix?: FolderType;
  }): Promise<any> {
    const { file, user, prefix } = data;

    try {
      console.log(file);
      return await this.uploadService.uploadFile({
        filePath: file.path,
        fileName: file.filename,
        authorId: user.id,
        mimetype: file.mimetype,
        prefix: prefix ?? 'avatar',
        imageBuffer: file.buffer,
      });
    } catch (err) {
      console.log('[SERVER ERROR][UploadToS3Controller]: ', err);
      return { statusCode: 500, isSuccess: false, error: err.message };
    }
  }
  @MessagePattern({ cmd: 'DELETE_FILE' })
  async deleteFile(data: { id: string; prefix?: FolderType }): Promise<any> {
    const { id, prefix } = data;
    try {
      return await this.uploadService.deleteFile({
        id: id,
        prefix: prefix ?? 'avatar',
      });
    } catch (err) {
      console.log('[SERVER ERROR][UploadToS3Controller]: ', err);
      return err;
    }
  }
}
