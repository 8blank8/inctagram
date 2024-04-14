import { config } from 'dotenv'
config()
import { Injectable } from "@nestjs/common";
import { CreateUserCommand } from "./dto/create-user.command";
import { UserEntity } from "../../entities/user.entity";
import { Result } from '../../../../../../../libs/core/result';
import { IdCreated } from '../../../../core/id-created';
import { TransactionDecorator } from '../../../../infra/inside-transaction';
import { DataSource, EntityManager } from 'typeorm';
import { UserRepository } from '../../repository/user.repository';
import { hashPassword } from '../../../../utils/hash-password';
import { v4 as uuid } from 'uuid'


@Injectable()
export class CreateUserUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository
    ) { }

    async execute(command: CreateUserCommand): Promise<Result<UserEntity>> {

        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        );
    }

    async doOperation(
        { email, password, username }: CreateUserCommand,
        manager: EntityManager
    ): Promise<Result<UserEntity>> {

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

                return Result.Ok(createdUser)
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

                return Result.Ok(createdUser)
            }

            const user = new UserEntity()

            createdUser = await this.createUser(
                user,
                email,
                username,
                passwordHash,
                passwordSalt,
                manager
            )

            return Result.Ok(createdUser)

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