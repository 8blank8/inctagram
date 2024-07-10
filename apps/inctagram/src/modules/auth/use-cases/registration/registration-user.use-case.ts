import { Injectable } from "@nestjs/common";
import { RegistrationUserCommand } from "./dto/registration-user.command";
import { Result } from "../../../../../../../libs/core/result";
import { IdCreated } from "../../../../../../../libs/core/id-created";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";
import { CreateUserUseCase } from "@inctagram/src/modules/user/use-cases/create/create-user.use-case";
import { EmailConfirmationEntity } from "@libs/infra/entities/email-confirmation.entity";
import { v4 as uuid } from 'uuid'
import { DataSource, EntityManager } from "typeorm";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { SomeError } from "@libs/core/custom-error";


@Injectable()
export class RegistrationUserUseCase {
    constructor(
        private mailService: MailService,
        private createUserUseCase: CreateUserUseCase,
        private dataSource: DataSource
    ) { }

    async execute(command: RegistrationUserCommand): Promise<Result<IdCreated>> {

        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        command: RegistrationUserCommand,
        manager: EntityManager
    ): Promise<Result<IdCreated>> {
        try {

            const user = await this.createUserUseCase.execute(command, manager)
            if (!user.isSuccess) return Result.Err(user.err.message)

            const emailConfirmation = new EmailConfirmationEntity()
            emailConfirmation.confirmationCode = uuid()
            emailConfirmation.createdAt = new Date()
            emailConfirmation.updatedAt = new Date()
            emailConfirmation.user = user.value

            await manager.save(emailConfirmation)

            await this.mailService.sendEmailConfirmationMessage(user.value.email, user.value.username, emailConfirmation.confirmationCode)

            return Result.Ok({ id: user.value.id })

        } catch (e) {
            console.log(RegistrationUserUseCase.name + e)
            return Result.Err(new SomeError(`${RegistrationUserUseCase.name} some error`))
        }
    }
}