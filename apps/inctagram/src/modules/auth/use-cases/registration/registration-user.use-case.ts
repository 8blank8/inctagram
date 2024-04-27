import { Injectable } from "@nestjs/common";
import { RegistrationUserCommand } from "./dto/registration-user.command";
import { Result } from "../../../../../../../libs/core/result";
import { IdCreated } from "../../../../../../../libs/core/id-created";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { UserRepository } from "@inctagram/src/modules/user/repository/user.repository";
import { hashPassword } from "@inctagram/src/utils/hash-password";
import { v4 as uuid } from 'uuid'
import { UserEntity } from "@libs/infra/entities/user.entity";


@Injectable()
export class RegistrationUserUseCase {
    constructor(
        private mailService: MailService,
        private dataSource: DataSource,
        private userRepo: UserRepository
    ) { }

    async execute(command: RegistrationUserCommand): Promise<Result<IdCreated>> {

        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        );
    }

    async doOperation(
        { email, password, username }: RegistrationUserCommand,
        manager: EntityManager
    ): Promise<Result<IdCreated>> {

        try {

            const findedUserEmail = await this.userRepo.getUserByEmail(email)
            if (findedUserEmail && findedUserEmail.emailConfirmed) return Result.Err('user with email is exist')

            const findedUserUsername = await this.userRepo.getUserByUsername(username)
            if (findedUserUsername && findedUserUsername.emailConfirmed) return Result.Err('user with username is exist')

            const { passwordHash, passwordSalt } = await hashPassword(password)

            let createdUser: UserEntity

            if (findedUserEmail && !findedUserEmail.emailConfirmed) {
                createdUser = await this.createUser(
                    findedUserEmail,
                    email,
                    username,
                    passwordHash,
                    passwordSalt,
                    manager
                )
            }

            if (findedUserUsername && !findedUserUsername.emailConfirmed) {
                createdUser = await this.createUser(
                    findedUserUsername,
                    email,
                    username,
                    passwordHash,
                    passwordSalt,
                    manager
                )
            }

            if (!createdUser) {
                const user = new UserEntity()

                createdUser = await this.createUser(
                    user,
                    email,
                    username,
                    passwordHash,
                    passwordSalt,
                    manager
                )
            }
            await this.mailService.sendEmailConfirmationMessage(email, username, createdUser.confirmationCode)

            return Result.Ok({ id: createdUser.id })

        } catch (e) {
            console.log(e)
            return Result.Err('CreateUserUseCase error')
        }
    }

    async createUser(user: UserEntity, email: string, username: string, passwordHash: string, passwordSalt: string, manager: EntityManager): Promise<UserEntity> {

        user.username = username
        user.email = email
        user.createdAt = new Date()
        user.passwordHash = passwordHash
        user.passwordSalt = passwordSalt
        user.confirmationCode = uuid()

        return manager.save(user)
    }
}