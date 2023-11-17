import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @MessagePattern({ cmd: 'UPLOAD_FILE' })
  async uploadFile(data: {
    req: Request;
    file: Express.Multer.File;
  }): Promise<any> {
    const { file, req } = data;
    console.log(req);
    try {
      const uploadedImage = await this.uploadService.uploadFile(
        file.path,
        file.filename,
        file.mimetype,
      );
      return { statusCode: 200, isSuccess: true, data: uploadedImage };
    } catch (err) {
      console.log(
        '[SERVER ERROR][UploadToS3Controller =========>>>>>>>>]: ',
        err,
      );
      return { statusCode: 500, isSuccess: false, error: err.message };
    }
  }
}
