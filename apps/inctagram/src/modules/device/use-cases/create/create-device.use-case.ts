import { Injectable } from "@nestjs/common";
import { CreateDeviceCommand } from "./dto/create-device.command";
import { DeviceEntity } from "../../entities/device.entity";
import { Result } from "../../../../../../../libs/core/result";
import { EntityManager } from "typeorm";
import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity";


@Injectable()
export class CreateDeviceUseCase {
    async execute(command: CreateDeviceCommand, manager: EntityManager): Promise<Result<DeviceEntity>> {
        const { title, userId } = command

        const user = await manager.findOneBy(UserEntity, { id: userId })
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
    }
}