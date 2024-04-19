import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity";
import { CreateUserCommand } from "@inctagram/src/modules/user/use-cases/create/dto/create-user.command";
import { hashPassword } from "@inctagram/src/utils/hash-password";
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
        try {
            const user = new UserEntity()
            const { passwordHash, passwordSalt } = await hashPassword(dto.password)

            user.email = dto.email
            user.username = dto.username
            user.emailConfirmed = options?.emailConfirmed ?? true
            user.createdAt = new Date()
            user.passwordHash = passwordHash
            user.passwordSalt = passwordSalt
            user.confirmationCode = options?.emailConfirmationCode ?? null
            user.passwordRecoveryCode = options?.resetPasswordCode ?? null

            return this.manager.save(user)
        } catch (e) {
            console.log(e)
        }
    }
}