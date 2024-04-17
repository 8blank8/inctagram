import { Injectable } from "@nestjs/common";
import { UpdateUserCommand } from "./dto/update-user.command";
import { Result } from "@libs/core/result";
import { UserRepository } from "../../repository/user.repository";
import { TransactionDecorator } from "@inctagram/src/infra/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { userIsOver13 } from "@inctagram/src/utils/is-over-13";


@Injectable()
export class UpdateUserUseCase {
    constructor(
        private userRepo: UserRepository,
        private dataSource: DataSource,
    ) { }

    async execute(command: UpdateUserCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        data: UpdateUserCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {
            const { dateOfBirth, firstname, lastname, username, aboutMe, userId } = data

            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err(`user with id: ${userId} not found`)
            if (!user.emailConfirmed) return Result.Err('user email not confirmed')

            const isOver13 = userIsOver13(dateOfBirth)
            if (!isOver13) return Result.Err('A user under 13 cannot create a profile')

            const isUsername = await this.userRepo.getUserByUsername(username)
            if (isUsername && user.username !== username) return Result.Err(`user with username: ${username} is exist`)

            user.firstname = firstname
            user.lastname = lastname
            user.dateOfBirth = new Date(dateOfBirth)
            user.aboutMe = aboutMe ?? null
            user.updatedAt = new Date()

            await manager.save(user)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('update user something error')
        }
    }
}