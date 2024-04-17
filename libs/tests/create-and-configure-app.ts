import { DataSource } from "typeorm";
import { CreateTestModule } from "./create-test-module";


export const createAndConfigureAppForTests = async () => {

    let moduleRef = await CreateTestModule()
        .compile();

    const app = moduleRef.createNestApplication();

    const dataSource = await moduleRef.resolve(DataSource);
    const manager = dataSource.manager;
    const queryRunner = manager.connection.createQueryRunner();

    return { moduleRef, app, manager, queryRunner, dataSource }
}