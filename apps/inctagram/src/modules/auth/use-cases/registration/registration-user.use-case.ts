import { Injectable } from "@nestjs/common";
import { RegistrationUserCommand } from "./dto/registration-user.command";
import { Result } from "../../../../../../../libs/core/result";
import { IdCreated } from "../../../../../../../libs/core/id-created";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";
import { CreateUserUseCase } from "@inctagram/src/modules/user/use-cases/create/create-user.use-case";


@Injectable()
export class RegistrationUserUseCase {
    constructor(
        private mailService: MailService,
        private createUserUseCase: CreateUserUseCase
    ) { }

    async execute(command: RegistrationUserCommand): Promise<Result<IdCreated>> {

        const user = await this.createUserUseCase.execute(command)
        if (!user.isSuccess) return Result.Err(user.err.message)

        await this.mailService.sendEmailConfirmationMessage(user.value.email, user.value.username, user.value.confirmationCode)

        return Result.Ok({ id: user.value.id })
    }
}