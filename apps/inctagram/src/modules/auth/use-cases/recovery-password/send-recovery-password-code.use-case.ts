import { Injectable } from "@nestjs/common";
import { SendRecoveryPasswordCodeCommand } from "./dto/send-recovery-password-code.command";
import { UserRepository } from "../../../user/repository/user.repository";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";
import { Result } from "../../../../../../../libs/core/result";
import { v4 as uuid } from 'uuid'
import { TransactionDecorator } from "../../../../infra/inside-transaction";
import { DataSource, EntityManager } from "typeorm";


@Injectable()
export class SendRecoveryPasswordCodeUseCase {
    constructor(
        private userRepo: UserRepository,
        private mailService: MailService,
        private dataSource: DataSource
    ) { }

    async execute(command: SendRecoveryPasswordCodeCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { email }: SendRecoveryPasswordCodeCommand,
        manager: EntityManager
    ): Promise<Result<void>> {

        try {
            const user = await this.userRepo.getUserByEmail(email)
            if (!user) return Result.Err('user not found')

            user.passwordRecoveryCode = uuid()
            await manager.save(user)

            await this.mailService.sendEmailPassRecovery(user.email, user.passwordRecoveryCode)

            return Result.Ok()

        } catch (e) {
            console.log(e)
            return Result.Err('code not sended')
        }


    }
}