import { Injectable } from '@nestjs/common';
// import { readFileSync, unlinkSync, writeFile } from 'fs';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { FilesRepository, FolderType } from './repository/files.repository';

interface DeletePayload {
  id: string;
  prefix: FolderType;
}
interface FilePayload {
  filePath: string;
  mimetype: string;
  fileName: string;
  authorId: string;
  prefix: FolderType;
  imageBuffer: Buffer;
}

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.get('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
    },
  });

  constructor(
    private configService: ConfigService,
    private filesRepository: FilesRepository,
  ) {}

  async resize(imageBuffer: Buffer) {
    // resizing part started from here
    // const base64 = readFileSync(filePath);
    const img = sharp(imageBuffer);
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
    const {
      //  filePath,
      mimetype,
      fileName,
      prefix,
      authorId,
      imageBuffer,
    } = payload;
    const storePath = [prefix, authorId, fileName].join('/');
    try {
      const { buffer, metadata } = await this.resize(imageBuffer);
      // writeFile(filePath, buffer, 'binary', async (error) => {
      //   if (!error) {
      await this.uploadToS3(buffer, storePath, mimetype);
      //   } else {
      //     return { message: 'uploaded unsuccessfully' };
      //   }
      // });
      const fileData = {
        url: `https://inctagram-trainee.s3.eu-central-1.amazonaws.com/${storePath}`,
        authorId: authorId,
        title: fileName,
        size: metadata.size.toString(),
      };
      return await this.filesRepository.saveFileData(fileData, prefix);
    } catch (err) {
      // unlinkSync(filePath);
      console.log('[SERVER ERROR][UploadToS3Service:uploadFile]: ', err);
      throw err;
    }
  }

  async deleteFile(payload: DeletePayload) {
    const { id, prefix } = payload;
    const file = await this.filesRepository.getFile(id);
    const storePath = [prefix, file.authorId, file.title].join('/');
    let result = {
      $metadata: undefined,
    };
    if (file.url.includes('inctagram-trainee.s3.eu-central-1.amazonaws.com')) {
      result = await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
          Key: storePath,
        }),
      );
    } else {
      result.$metadata.httpStatusCode = 204;
    }
    if (result.$metadata.httpStatusCode === 204) {
      return await this.filesRepository.deleteFile(id);
    }
    return { message: 'deleted unsuccessfully' };
  }

  private async uploadToS3(buffer: Buffer, fileName: string, fileType: string) {
    // const blob = readFileSync(filePath);
    const uploadedImage: PutObjectCommandOutput = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: buffer,
        ContentType: fileType,
      }),
    );
    // unlinkSync(filePath);
    return uploadedImage;
  }
}
