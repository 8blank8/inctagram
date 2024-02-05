import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { FilesRepository } from './repository/files.repository';
// import { readFile } from 'node:fs/promises';
// import { Readable } from 'node:stream';

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [ConfigService, UploadService, PrismaService, FilesRepository],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('upload file', async () => {
  //   const f: Buffer = await readFile('./apps/files/src/upload/10.jpg')

  //   const file: Express.Multer.File = {
  //     fieldname: 'file',
  //     originalname: 'file.txt',
  //     encoding: '7bit',
  //     mimetype: 'text/plain',
  //     destination: 'destination/path',
  //     filename: '10.jpg',
  //     // path: localFilePath,
  //     size: 12345,
  //     stream: new Readable,
  //     path: '',
  //     buffer: f
  //   }
  //   controller.uploadFile({
  //     file,
  //     user: {
  //       id: '',
  //       email: '',
  //       createdAt: undefined,
  //       updatedAt: undefined,
  //       username: '',
  //       emailConfirmed: false,
  //       password: ''
  //     }
  //   })
  // })
});
