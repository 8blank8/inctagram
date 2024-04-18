import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { appSetting } from "@libs/core/app-setting";
import { Result } from "@libs/core/result";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class S3Service {
    constructor(
        @Inject('S3')
        private s3: S3Client
    ) { }

    async upload(url: string, buffer: Buffer): Promise<Result<void>> {
        try {
            const params = {
                Bucket: appSetting.AWS_S3_BUCKET_NAME,
                Key: url,
                Body: buffer,
            };

            const command = new PutObjectCommand(params);
            await this.s3.send(command);

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('upload image something error')
        }
    }

    async delete(url: string): Promise<Result<void>> {
        try {
            const params = {
                Bucket: appSetting.AWS_S3_BUCKET_NAME,
                Key: url,
            };
            const command = new DeleteObjectCommand(params);
            await this.s3.send(command);

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('delete image something error')
        }
    }
}