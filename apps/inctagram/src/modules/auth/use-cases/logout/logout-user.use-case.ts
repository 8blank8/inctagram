import { Injectable } from "@nestjs/common";
import { LogoutUserCommand } from "./dto/logout-user.command";
import { TransactionDecorator } from "../../../../../../../libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { DeviceRepository } from "../../../device/repository/device.repository";
import { Result } from "@libs/core/result";
import { TokenService } from "../../services/token.service";


@Injectable()
export class LogoutUserUseCase {
    constructor(
        private dataSource: DataSource,
        private deviceRepo: DeviceRepository,
        private tokenService: TokenService
    ) { }

    async execute(command: LogoutUserCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { deviceId, userId, refreshToken }: LogoutUserCommand,
        manager: EntityManager,
    ): Promise<Result<void>> {

        try {
            const device = await this.deviceRepo.getDeviceById(deviceId)
            if (!device) return Result.Err('device not found')
            if (device.user.id !== userId) return Result.Err('user not owner this device')

            await manager.remove(device)

            await this.tokenService.createExpriredTokenAndSave(refreshToken, manager)

            return Result.Ok()

        } catch (e) {
            console.log(e)
            return Result.Err('logout some error')
        }
    }
}