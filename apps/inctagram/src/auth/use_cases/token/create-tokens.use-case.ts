import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenEntity } from "../../entity/token.entity";
import { UserRepository } from "@app/main/user/repository/user.repository";
import { SecurityRepository } from "@app/main/security/repository/security.repository";
import { createTokens } from "@app/auth/tokens/create-tokens";
import { CreateTokensCommand } from "./dto/create-tokens.command";


@Injectable()
export class CreateTokensUseCase {
    constructor(
        private jwtService: JwtService,
        private userRepo: UserRepository,
        private securityRepo: SecurityRepository
    ) { }

    async execute(command: CreateTokensCommand): Promise<TokenEntity> {
        const { deviceId, userId } = command

        const user = await this.userRepo.findUserById(userId)
        if (!user) throw new UnauthorizedException()

        const device = await this.securityRepo.findDeviceById(deviceId)
        if (!device) throw new UnauthorizedException()

        const { accessToken, refreshToken } = await createTokens(this.jwtService, user.id, device.id)

        return {
            accessToken,
            refreshToken
        }
    }
}