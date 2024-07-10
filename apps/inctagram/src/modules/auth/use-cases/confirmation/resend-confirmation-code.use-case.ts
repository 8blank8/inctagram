import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../../user/repository/user.repository";
import { ResendConfirmationCodeCommand } from "./dto/resend-confirmation-code.command";
import { Result } from "../../../../../../../libs/core/result";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";
import { v4 as uuid } from 'uuid'
import { DataSource, EntityManager } from "typeorm";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { EmailIsConfirmedError, SomeError, UserWithEmailNotFoundError } from "@libs/core/custom-error";


@Injectable()
export class ResendConfirmationCodeUseCase {
    constructor(
        private userRepo: UserRepository,
        private mailService: MailService,
        private dataSource: DataSource
    ) { }

    async execute(command: ResendConfirmationCodeCommand): Promise<Result> {

        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { email }: ResendConfirmationCodeCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {

            const user = await this.userRepo.getUserByEmail(email)
            if (!user) return Result.Err(new UserWithEmailNotFoundError(email))
            if (user.emailConfirmed) return Result.Err(new EmailIsConfirmedError())

            user.confirmation.confirmationCode = uuid()
            user.confirmation.updatedAt = new Date()

            await manager.save(user)

            await this.mailService.sendEmailConfirmationMessage(user.email, user.username, user.confirmation.confirmationCode)

            return Result.Ok()

        } catch (e) {
            console.log(ResendConfirmationCodeUseCase.name + e)
            return Result.Err(new SomeError(`${ResendConfirmationCodeUseCase.name} some error`))
        }
    }
}