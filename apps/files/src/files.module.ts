import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UploadModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
