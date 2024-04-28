import { FilesModule } from "@files/src/files.module";
import { validationPipeConfig } from "@libs/core/validation-pipe.config";
import { ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as cookieParser from 'cookie-parser'
import { DataSource } from "typeorm";


export const CreateAppForE2eTestsFiles = async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [FilesModule],
    }).compile();

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