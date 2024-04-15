import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { ResetUserPasswordCommand } from "./dto/reset-user-password.command";
import { Result } from "../../../../../../../libs/core/result";
import { TransactionDecorator } from "../../../../infra/inside-transaction";
import { UserRepository } from "../../../user/repository/user.repository";
import { hashPassword } from "../../../../utils/hash-password";


@Injectable()
export class ResetUserPasswordUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
    ) { }

    async execute(command: ResetUserPasswordCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { code, password }: ResetUserPasswordCommand,
        manager: EntityManager
    ): Promise<Result<void>> {

        try {
            const user = await this.userRepo.getUserByResetPasswordCode(code)
            if (!user) return Result.Err('user not found')

            const { passwordHash, passwordSalt } = await hashPassword(password)

            user.passwordRecoveryCode = null
            user.passwordHash = passwordHash
            user.passwordSalt = passwordSalt

            await manager.save(user)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('password not changed')
        }
    }
}