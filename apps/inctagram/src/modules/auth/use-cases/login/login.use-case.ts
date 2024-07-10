import { Injectable } from "@nestjs/common";
import { LoginUserCommand } from "./dto/login.command";
import { Result } from "../../../../../../../libs/core/result";
import { UserRepository } from "../../../user/repository/user.repository";
import { BadCredentialsError, EmailNotConfirmedError, SomeError } from "../../../../../../../libs/core/custom-error";
import { hashPassword } from "../../../../utils/hash-password";
import { CreateDeviceUseCase } from "../../../device/use-cases/create/create-device.use-case";
import { JwtService } from "@nestjs/jwt";
import { DataSource, EntityManager } from "typeorm";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { createJwtTokens } from "@libs/jwt/create-tokens";


@Injectable()
export class LoginUserUseCase {
    constructor(
        private userRepo: UserRepository,
        private createDeviceUseCase: CreateDeviceUseCase,
        private jwtService: JwtService,
        private dataSource: DataSource
    ) { }

    async execute(command: LoginUserCommand): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { email, password, title, ip }: LoginUserCommand,
        manager: EntityManager
    ): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        try {

            const user = await this.userRepo.getUserByEmail(email)
            if (!user) return Result.Err(new BadCredentialsError())
            if (!user.emailConfirmed) return Result.Err(new EmailNotConfirmedError())

            const { passwordHash } = await hashPassword(password, user.passwordSalt)
            if (passwordHash !== user.passwordHash) return Result.Err(new BadCredentialsError())

            const device = await this.createDeviceUseCase.execute({
                title,
                userId: user.id,
                ip: ip
            }, manager)
            if (!device.isSuccess) return Result.Err(device.err)

            const { accessToken, refreshToken } = await createJwtTokens(this.jwtService, user.id, device.value.id)

            return Result.Ok({ accessToken, refreshToken })
        } catch (e) {
            console.log(e)
            return Result.Err(new SomeError(`${LoginUserUseCase.name} some error`))
        }
    }

}