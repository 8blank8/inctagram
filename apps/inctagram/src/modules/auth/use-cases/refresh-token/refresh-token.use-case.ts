import { Injectable } from "@nestjs/common";
import { RefreshTokenCommand } from "./dto/refresh-token.command";
import { Result } from "@libs/core/result";
import { UserRepository } from "../../../user/repository/user.repository";
import { createJwtTokens } from "../../../../utils/create-tokens";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private userRepo: UserRepository,
        private jwtService: JwtService,
    ) { }

    async execute(command: RefreshTokenCommand): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        const { deviceId, userId } = command

        const user = await this.userRepo.getUserWithDevicesById(userId)
        if (!user) return Result.Err('user not found')

        const device = user.devices.find(device => device.id === deviceId)
        if (!device) return Result.Err('device not found')

        const { accessToken, refreshToken } = await createJwtTokens(this.jwtService, user.id, deviceId)

        return Result.Ok({ accessToken, refreshToken })
    }
}