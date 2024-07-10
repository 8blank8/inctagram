import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { DeleteDeviceCommand } from "./dto/delete-device.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { DeviceRepository } from "../../repository/device.repository";


@Injectable()
export class DeleteDevicesUseCase {
    constructor(
        private dataSource: DataSource,
        private deviceRepo: DeviceRepository
    ) { }

    async execute(command: DeleteDeviceCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { deviceId, userId }: DeleteDeviceCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {

            const devices = await this.deviceRepo.getDevicesExceptCurrentUser(userId, deviceId)
            if (!devices.length) return Result.Ok()

            await manager.remove(devices)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err(`${DeleteDevicesUseCase.name} some error`)
        }
    }
}