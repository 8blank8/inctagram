import * as cookieParser from 'cookie-parser';
import { DataSource } from "typeorm";
import { CreateTestModule } from "./create-test-module";


export const createAndConfigureAppForTests = async () => {

    let moduleRef = await CreateTestModule()
        .compile();

    const app = moduleRef.createNestApplication();

    //   app.useGlobalPipes(new ValidationPipe(validationConfig));

    app.use(cookieParser())

    const httpServer = app.getHttpServer();

    const dataSource = await moduleRef.resolve(DataSource);
    const manager = dataSource.manager;
    const queryRunner = manager.connection.createQueryRunner();

    return { moduleRef, app, httpServer, manager, queryRunner, dataSource }
}