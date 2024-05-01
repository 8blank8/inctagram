import { ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as cookieParser from 'cookie-parser'
import { DataSource } from "typeorm";
import { ReadModule } from "../src/read.module";
import { validationPipeConfig } from "@libs/core/validation-pipe.config";


export const CreateAppForE2eTestsRead = async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [ReadModule],
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