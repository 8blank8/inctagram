import { Injectable } from "@nestjs/common";
import { RegistrationUserCommand } from "./dto/registration-user.command";
import { CreateUserUseCase } from "../../../user/use-cases/create/create-user.use-case";
import { Result } from "../../../../../../../libs/core/result";
import { IdCreated } from "../../../../core/id-created";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";


@Injectable()
export class RegistrationUserUseCase {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private mailService: MailService
    ) { }

    async execute(command: RegistrationUserCommand): Promise<Result<IdCreated>> {
        const res = await this.createUserUseCase.execute(command)
        if (!res.isSuccess) return res

        await this.mailService.sendEmailConfirmationMessage(command.email, res.value.confirmationCode)

        return Result.Ok({ id: res.value.id })
    }
}