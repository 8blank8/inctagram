import { Injectable } from "@nestjs/common";
import { RegistrationUserCommand } from "./dto/registration-user.command";
import { CreateUserUseCase } from "../../../user/use-cases/create/create-user.use-case";
import { Result } from "../../../../../../../libs/core/result";
import { IdCreated } from "../../../../../../../libs/core/id-created";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { UserRepository } from "@inctagram/src/modules/user/repository/user.repository";
import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity";
import { hashPassword } from "@inctagram/src/utils/hash-password";
import { v4 as uuid } from 'uuid'


@Injectable()
export class RegistrationUserUseCase {
    constructor(
        private createUserUseCase: CreateUserUseCase,
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

                return Result.Ok({ id: createdUser.id })
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

                return Result.Ok({ id: createdUser.id })
            }

            const user = new UserEntity()
            console.log(user)
            createdUser = await this.createUser(
                user,
                email,
                username,
                passwordHash,
                passwordSalt,
                manager
            )

            this.mailService.sendEmailConfirmationMessage(email, createdUser.confirmationCode)

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

        console.log(user)
        return manager.save(user)
    }
}