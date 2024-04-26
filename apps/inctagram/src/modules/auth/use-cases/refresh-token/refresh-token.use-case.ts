import { Injectable } from "@nestjs/common";
import { RefreshTokenCommand } from "./dto/refresh-token.command";
import { Result } from "@libs/core/result";
import { UserRepository } from "../../../user/repository/user.repository";
import { JwtService } from "@nestjs/jwt";
import { createJwtTokens } from "@libs/jwt/create-tokens";
import { DataSource, EntityManager } from "typeorm";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { DeviceRepository } from "@inctagram/src/modules/device/repository/device.repository";
import { TokenService } from "../../services/token.service";


@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private userRepo: UserRepository,
        private jwtService: JwtService,
        private deviceRepo: DeviceRepository,
        private dataSource: DataSource,
        private tokenService: TokenService
    ) { }

    async execute(command: RefreshTokenCommand): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { deviceId, userId, refreshToken }: RefreshTokenCommand,
        manager: EntityManager
    ): Promise<Result<{ accessToken: string, refreshToken: string }>> {

        const user = await this.userRepo.getUserWithDevicesById(userId)
        if (!user) return Result.Err('user not found')

        const device = await this.deviceRepo.getDeviceById(deviceId)
        if (!device) return Result.Err('device not found')
        if (device.user.id !== user.id) return Result.Err('user not owner this device')

        device.updatedAt = new Date()

        await this.tokenService.createExpriredTokenAndSave(refreshToken, manager)

        await manager.save(device)

        const tokens = await createJwtTokens(this.jwtService, user.id, deviceId)

        return Result.Ok({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
    }
}