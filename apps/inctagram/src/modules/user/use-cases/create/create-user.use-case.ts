import { config } from 'dotenv'
config()
import { Injectable } from "@nestjs/common";
import { CreateUserCommand } from "./dto/create-user.command";
import { UserEntity } from "../../../../../../../libs/infra/entities/user.entity";
import { Result } from '../../../../../../../libs/core/result';
import { TransactionDecorator } from '../../../../../../../libs/infra/inside-transaction/inside-transaction';
import { DataSource, EntityManager } from 'typeorm';
import { UserRepository } from '../../repository/user.repository';
import { hashPassword } from '../../../../utils/hash-password';
import { SomeError, UserWithEmailIsExistError, UserWithUsernameIsExistError } from '@libs/core/custom-error';

class UserDto {
    email: string
    username: string
    passwordHash: string
    passwordSalt: string
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository
    ) { }

    async execute(command: CreateUserCommand, manager?: EntityManager): Promise<Result<UserEntity>> {

        if (manager) {
            return this.doOperation(command, manager)
        }

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
            if (findedUserEmail && findedUserEmail.emailConfirmed) return Result.Err(new UserWithEmailIsExistError(findedUserEmail.email))

            const findedUserUsername = await this.userRepo.getUserByUsername(username)
            if (findedUserUsername && findedUserUsername.emailConfirmed) return Result.Err(new UserWithUsernameIsExistError(findedUserUsername.username))

            const { passwordHash, passwordSalt } = await hashPassword(password)

            let createdUser: UserEntity

            const dto: UserDto = {
                email,
                passwordHash,
                passwordSalt,
                username
            }

            if (findedUserEmail && !findedUserEmail.emailConfirmed) createdUser = await this.createUser(findedUserEmail, manager, dto)

            if (findedUserUsername && !findedUserUsername.emailConfirmed) createdUser = await this.createUser(findedUserUsername, manager, dto)

            if (!createdUser) {
                const user = new UserEntity()

                createdUser = await this.createUser(
                    user,
                    manager,
                    dto
                )
            }

            return Result.Ok(createdUser)
        } catch (e) {
            console.log(e)
            return Result.Err(new SomeError(`${CreateUserUseCase.name}, some error`))
        }
    }

    async createUser(user: UserEntity, manager: EntityManager, dto: UserDto): Promise<UserEntity> {

        const { email, passwordHash, passwordSalt, username } = dto

        user.username = username
        user.email = email
        user.createdAt = new Date()
        user.passwordHash = passwordHash
        user.passwordSalt = passwordSalt

        return manager.save(user)
    }
}