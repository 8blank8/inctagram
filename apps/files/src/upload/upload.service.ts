import { Injectable } from '@nestjs/common';
import { readFileSync, unlinkSync, writeFile } from 'fs';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { FilesRepository, FolderType } from './repository/files.repository';

interface FilePayload {
  filePath: string;
  fileName: string;
  authorId: string;
  mimetype: string;
  prefix: FolderType;
}

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow(
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
    },
  });

  constructor(
    private configService: ConfigService,
    private filesRepository: FilesRepository,
  ) {}

  async resize(filePath: string) {
    // resizing part started from here
    const base64 = readFileSync(filePath);
    const img = sharp(base64, {});
    let metadata = await img.metadata();
    let buffer;
    if (metadata.width > 800) {
      buffer = await img.resize({ width: 800 }).toBuffer(); // resize if too big
      metadata = await img.metadata();
    } else {
      buffer = await img.toBuffer();
    }
    return { buffer, metadata };
  }

  async uploadFile(payload: FilePayload) {
    const { filePath, mimetype, fileName, prefix, authorId } = payload;
    const storePath = [prefix, authorId, fileName].join('/');
    try {
      const { buffer, metadata } = await this.resize(filePath);
      writeFile(filePath, buffer, 'binary', async (error) => {
        if (!error) {
          const s3Res = await this.uploadToS3(filePath, storePath, mimetype);
          console.log('s3Res ==========>>>>>>>>', s3Res);
        } else {
          return { message: 'uploaded unsuccessfully' };
        }
      });
      const fileData = {
        url: `https://inctagram-trainee.s3.eu-central-1.amazonaws.com/${storePath}`,
        authorId: authorId,
        title: fileName,
        size: metadata.size.toString(),
      };
      return await this.filesRepository.saveFileData(fileData, prefix);
    } catch (err) {
      unlinkSync(filePath);
      console.log('[SERVER ERROR][UploadToS3Service:uploadFile]: ', err);
      throw err;
    }
  }

  private async uploadToS3(filePath: any, fileName: string, fileType: string) {
    const blob = readFileSync(filePath);
    const uploadedImage: PutObjectCommandOutput = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: blob,
        ContentType: fileType,
      }),
    );
    unlinkSync(filePath);
    return uploadedImage;
  }
}
