import { Injectable } from "@nestjs/common";
import { LogoutUserCommand } from "./dto/logout-user.command";
import { TransactionDecorator } from "../../../../../../../libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { DeviceRepository } from "../../../device/repository/device.repository";
import { Result } from "@libs/core/result";


@Injectable()
export class LogoutUserUseCase {
    constructor(
        private dataSource: DataSource,
        private deviceRepo: DeviceRepository
    ) { }

    async execute(command: LogoutUserCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { deviceId, userId }: LogoutUserCommand,
        manager: EntityManager
    ): Promise<Result<void>> {

        try {
            const device = await this.deviceRepo.getDeviceById(deviceId)
            if (!device) return Result.Err('device not found')
            if (device.user.id !== userId) return Result.Err('user not owner this device')

            await manager.remove(device)

            return Result.Ok()

        } catch (e) {
            console.log(e)
            return Result.Err('logout some error')
        }
    }
}