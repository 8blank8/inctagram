import { Injectable } from "@nestjs/common";
import { ConfirmationUserCommand } from "./dto/confirmation-user.command";
import { UserRepository } from "../../../user/repository/user.repository";
import { Result } from "../../../../../../../libs/core/result";
import { TransactionDecorator } from "../../../../../../../libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { EmailIsConfirmedError, ExpiresConfirmationCodeError, SomeError, UserNotFoundError } from "@libs/core/custom-error";


@Injectable()
export class ConfirmationUserUseCase {
    constructor(
        private userRepo: UserRepository,
        private dataSource: DataSource
    ) { }

    async execute(command: ConfirmationUserCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { code }: ConfirmationUserCommand,
        manager: EntityManager
    ) {
        try {
            const user = await this.userRepo.getUserByConfirmationCode(code)
            if (!user) return Result.Err(new UserNotFoundError())
            if (user.emailConfirmed) return Result.Err(new EmailIsConfirmedError())

            const currentTime = new Date().getTime() - user.confirmation.updatedAt.getTime()
            if (currentTime > 900000) return Result.Err(new ExpiresConfirmationCodeError(user.email));

            user.emailConfirmed = true

            await manager.save(user)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err(new SomeError(`${ConfirmationUserUseCase.name} some error`))
        }
    }
}
