import { Injectable } from "@nestjs/common";
import { CreateDeviceCommand } from "./dto/create-device.command";
import { DeviceEntity } from "../../entities/device.entity";
import { Result } from "../../../../../../../libs/core/result";
import { UserRepository } from "../../../user/repository/user.repository";
import { TransactionDecorator } from "../../../../infra/inside-transaction";
import { DataSource, EntityManager } from "typeorm";


@Injectable()
export class CreateDeviceUseCase {
    constructor(
        private userRepo: UserRepository,
        private dataSource: DataSource
    ) { }

    async execute(command: CreateDeviceCommand): Promise<Result<DeviceEntity>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { title, userId }: CreateDeviceCommand,
        manager: EntityManager
    ): Promise<Result<DeviceEntity>> {
        try {

            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err('CreateDeviceUseCase: user not found')

            const device = new DeviceEntity()
            device.createdAt = new Date()
            device.title = title
            device.user = user

            await manager.save(device)

            if (!user.devices) {
                user.devices = [device]
            } else {
                user.devices.push(device)
            }

            await manager.save(user)

            return Result.Ok(device)
        } catch (e) {
            console.log(e)
            return Result.Err('CreateDeviceUseCase: device not created')
        }
    }
}