import * as cookieParser from 'cookie-parser';
import { DataSource } from "typeorm";
import { CreateTestModule } from "./create-test-module";
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';


export const createAndConfigureAppForTests = async () => {

    let moduleRef = await CreateTestModule()
        .compile();

    const app = moduleRef.createNestApplication();

    app.use(cookieParser())

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors: ValidationError[]) => {
            const errorsMessages = errors.map(e => {
                let message = null;

                if (e.constraints && Object.keys(e.constraints).length) {
                    message = e.constraints[Object.keys(e.constraints)[0]]
                }

                return {
                    field: e.property,
                    message
                }
            })

            throw new BadRequestException(errorsMessages)
        }
    }));

    const httpServer = app.getHttpServer();

    const dataSource = await moduleRef.resolve(DataSource);
    const manager = dataSource.manager;
    const queryRunner = manager.connection.createQueryRunner();

    return { moduleRef, app, httpServer, manager, queryRunner, dataSource }
}