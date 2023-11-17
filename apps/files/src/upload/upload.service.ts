import { Injectable } from '@nestjs/common';
import { readFileSync, unlinkSync, writeFile } from 'fs';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

  constructor(private configService: ConfigService) {}

  async uploadFile(filePath: string, fileName: string, fileType: string) {
    try {
      console.log('filePath ==>> ', filePath);
      // resizing part started from here
      const base64 = readFileSync(filePath);
      const img = sharp(base64, {});
      img
        .metadata()
        .then((metadata) => {
          if (metadata.width > 800) {
            return img.resize({ width: 800 }).toBuffer(); // resize if too big
          } else {
            return img.toBuffer();
          }
        })
        .then((data) => {
          writeFile(filePath, data, 'binary', async (error) => {
            console.log('filePath, fileName ==>> ', filePath, fileName);
            if (!error) {
              const s3Res = await this.uploadToS3(filePath, fileName, fileType);
              console.log('s3Res ==========>>>>>>>>', s3Res);
              return s3Res;
            } else {
              return { message: 'uploaded unsuccessfully' };
            }
          });
        });
      return { message: 'uploaded successfully' };
    } catch (err) {
      unlinkSync(filePath);
      console.log('[SERVER ERROR][UploadToS3Service:uploadFile]: ', err);
      throw err;
    }
  }

  private async uploadToS3(filePath: any, fileName: string, fileType: string) {
    const blob = readFileSync(filePath);
    fileName = fileName.replace(/\s/g, ''); // remove spaces between words
    const uploadedImage = await this.s3Client.send(
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
