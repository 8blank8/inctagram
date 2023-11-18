import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, UploadModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
