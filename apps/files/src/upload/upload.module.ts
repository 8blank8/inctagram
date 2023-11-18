import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaService } from '@app/db';
import { FilesRepository } from './repository/files.repository';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService, FilesRepository],
})
export class UploadModule {}
