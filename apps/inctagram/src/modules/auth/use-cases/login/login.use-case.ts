import { Injectable } from "@nestjs/common";
import { LoginUserCommand } from "./dto/login.command";
import { Result } from "../../../../../../../libs/core/result";
import { UserRepository } from "../../../user/repository/user.repository";
import { AuthError } from "../../../../../../../libs/core/custom-error";
import { hashPassword } from "../../../../utils/hash-password";
import { JwtService } from "@nestjs/jwt";
import { CreateDeviceUseCase } from "../../../device/use-cases/create/create-device.use-case";
import { createJwtTokens } from "../../../../utils/create-tokens";


@Injectable()
export class LoginUserUseCase {
    constructor(
        private userRepo: UserRepository,
        private jwtService: JwtService,
        private createDeviceUseCase: CreateDeviceUseCase
    ) { }

    async execute(command: LoginUserCommand): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        const { email, password, title } = command

        const user = await this.userRepo.getUserByEmail(email)
        if (!user) return Result.Err(new AuthError('The email or password are incorrect. Try again please'))

        const { passwordHash } = await hashPassword(password, user.passwordSalt)
        if (passwordHash !== user.passwordHash) return Result.Err(new AuthError('The email or password are incorrect. Try again please'))

        const device = await this.createDeviceUseCase.execute({
            title,
            userId: user.id
        })
        if (!device.isSuccess) return Result.Err(device.err)

        const { accessToken, refreshToken } = await createJwtTokens(this.jwtService, user.id, device.value.id)

        return Result.Ok({ accessToken, refreshToken })
    }
}