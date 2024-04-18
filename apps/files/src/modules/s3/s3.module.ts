import { Module } from "@nestjs/common";
import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from "./services/s3.service";
import { appSetting } from "@libs/core/app-setting";


@Module({
    providers: [
        {
            provide: 'S3',
            useFactory: () => {
                const s3Config = {
                    credentials: {
                        accessKeyId: appSetting.AWS_S3_ID,
                        secretAccessKey: appSetting.AWS_S3_KEY,
                    },
                    endpoint: 'https://storage.yandexcloud.net/incta-back',
                    region: 'ru-central1'
                };
                return new S3Client(s3Config);
            },
        },
        S3Service
    ],
    exports: [
        S3Service
    ]
})
export class S3Module { }