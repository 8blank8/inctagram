import { FilesModule } from "@files/src/files.module";
import { S3Service } from "@files/src/modules/s3/services/s3.service";
import { Result } from "@libs/core/result";
import { validationPipeConfig } from "@libs/core/validation-pipe.config";
import { ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as cookieParser from 'cookie-parser'
import { DataSource } from "typeorm";

export class S3ServiceMock {
    upload(url: string, buffer: Buffer) {
        return Result.Ok()
    }

    delete(url: string) {
        return Result.Ok()
    }
}


export const CreateAppForE2eTestsFiles = async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [FilesModule],
    })
        .overrideProvider(S3Service)
        .useClass(S3ServiceMock)
        .compile();

    const app = moduleRef.createNestApplication();

    app.use(cookieParser())

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    const httpServer = app.getHttpServer();

    const dataSource = await moduleRef.resolve(DataSource);
    const manager = dataSource.manager;
    const queryRunner = manager.connection.createQueryRunner();

    return {
        app,
        httpServer,
        moduleRef,
        manager,
        queryRunner
    }
}