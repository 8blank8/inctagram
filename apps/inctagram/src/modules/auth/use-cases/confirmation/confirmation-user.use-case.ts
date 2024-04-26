import { Injectable } from "@nestjs/common";
import { ConfirmationUserCommand } from "./dto/confirmation-user.command";
import { UserRepository } from "../../../user/repository/user.repository";
import { Result } from "../../../../../../../libs/core/result";
import { TransactionDecorator } from "../../../../../../../libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";


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
            if (!user) return Result.Err('user not found')
            if (user.emailConfirmed) return Result.Err('user is confirmed')

            user.emailConfirmed = true
            user.confirmationCode = null

            await manager.save(user)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('confirm email some error')
        }
    }
}