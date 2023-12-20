import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { FilesRepository, FolderType } from './repository/files.repository';
import calcImageSize from '@app/common/utils/calcImageSize';

interface DeletePayload {
  id: string;
  prefix: FolderType;
}
interface FilePayload extends Express.Multer.File {
  prefix: FolderType;
  authorId: string;
  cropProps?: string;
  fileName?: string;
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

  async resize(imageBuffer: ArrayBuffer) {
    const img = sharp(imageBuffer);
    let metadata = await img.metadata();
    let buffer;
    if (metadata.size > 3000) {
      const size = calcImageSize(metadata.width, metadata.height);
      buffer = await img.resize(size).toBuffer(); // resize if too big
      metadata = await sharp(buffer).metadata();
    } else {
      buffer = await img.toBuffer();
    }
    return { buffer, metadata };
  }

  async uploadFile(payload: FilePayload) {
    const {
      mimetype,
      cropProps,
      prefix,
      authorId,
      filename,
      originalname,
      buffer,
    } = payload;
    const fileName = originalname || filename;
    const storePath = [prefix, authorId, fileName].join('/');
    if (!buffer || !fileName) throw new Error('No image buffer or filename');
    try {
      const { buffer: sizedBuffer, metadata } = await this.resize(
        Buffer.from(buffer),
      );
      const res = await this.uploadToS3(sizedBuffer, storePath, mimetype);
      if (res !== 200) throw new Error('Error upload to S3');
      const fileData = {
        url: `https://inctagram-trainee.s3.eu-central-1.amazonaws.com/${storePath}`,
        authorId: authorId,
        title: fileName,
        cropProps,
        size: metadata.size.toString(),
      };
      return await this.filesRepository.saveFileData(fileData, prefix);
    } catch (err) {
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
    console.log('uploadToS3 ===>>>', fileName, fileType);
    const uploadedImage: PutObjectCommandOutput = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: buffer,
        ContentType: fileType,
      }),
    );
    return uploadedImage['$metadata'].httpStatusCode;
  }
}
