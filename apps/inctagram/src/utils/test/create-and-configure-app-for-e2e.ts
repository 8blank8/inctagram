import * as cookieParser from 'cookie-parser';
import { DataSource } from "typeorm";
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@inctagram/src/app.module';
import { MailService } from '@libs/mailer/mailer.service';
import { validationPipeConfig } from '@libs/core/validation-pipe.config';

export class MailServiceMock {
    async sendEmailConfirmationMessage(email: string, query: string): Promise<void> {
        console.log(email, query)
        return Promise.resolve();
    }

    async sendEmailPassRecovery(email: string, query: string): Promise<void> {
        console.log(email, query)
        return Promise.resolve();
    }
}

export const CreateAppForE2eTestsMain = async () => {

    let moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(MailService)
        .useClass(MailServiceMock)
        .compile()

    const app = moduleRef.createNestApplication();

    app.use(cookieParser())

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    const httpServer = app.getHttpServer();

    const dataSource = await moduleRef.resolve(DataSource);
    const manager = dataSource.manager;
    const queryRunner = manager.connection.createQueryRunner();

    return { moduleRef, app, httpServer, manager, queryRunner, dataSource }
}