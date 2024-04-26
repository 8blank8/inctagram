import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Not } from "typeorm";
import { DeviceRepository } from "../../repository/device.repository";
import { DeleteDeviceCommand } from "./dto/delete-device.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { DeviceEntity } from "../../entities/device.entity";


@Injectable()
export class DeleteDeviceUseCase {
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
            const device = await this.deviceRepo.getDeviceById(deviceId)
            if (!device) return Result.Ok()

            await manager.remove(device)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('delete device some err')
        }
    }
}