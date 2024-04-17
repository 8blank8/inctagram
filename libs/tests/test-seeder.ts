import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity";
import { CreateUserCommand } from "@inctagram/src/modules/user/use-cases/create/dto/create-user.command";
import { genSalt, hash } from "bcrypt";
import { EntityManager } from "typeorm";

export class CreateUserOptions {
    emailConfirmed?: boolean
    resetPasswordCode?: string
    emailConfirmationCode?: string
}

export class TestSeeder {
    private testCreator: TestCreator
    constructor(private manager: EntityManager) {
        this.testCreator = new TestCreator(this.manager)
    }

    getUserDto(num: number = 1): CreateUserCommand {
        return {
            email: `test${num}@yandex.ru`,
            password: 'password1$',
            username: `username${num}`
        }
    }

    getUserDtos(num: number): CreateUserCommand[] {
        const users: Array<CreateUserCommand> = []

        for (let i = 1; i <= num + 1; i++) {
            users.push(this.getUserDto(i))
        }
        return users
    }

    async createUser(dto: CreateUserCommand, options?: CreateUserOptions): Promise<UserEntity> {
        return this.testCreator.createUser(dto, options)
    }

    async createUsers(dtos: CreateUserCommand[]): Promise<UserEntity[]> {
        const users = []

        dtos.forEach(user => {
            users.push(this.createUser(user))
        });

        return users
    }
}

export class TestCreator {
    constructor(private manager: EntityManager) { }

    async createUser(dto: CreateUserCommand, options?: CreateUserOptions) {
        const user = new UserEntity()
        const passwordSalt = await genSalt(10)
        const passwordHash = await hash(dto.password, passwordSalt)

        user.email = dto.email
        user.username = dto.username
        user.emailConfirmed = options?.emailConfirmed ?? true
        user.createdAt = new Date()
        user.passwordHash = passwordHash
        user.passwordSalt = passwordSalt
        user.confirmationCode = options?.emailConfirmationCode ?? null
        user.passwordRecoveryCode = options?.resetPasswordCode ?? null

        return this.manager.save(user)
    }
}