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

        const user = await manager.findOne(UserEntity, {
            where: { id: userId },
            relations: { devices: true }
        })
        if (!user) return Result.Err('CreateDeviceUseCase: user not found')

        let device: DeviceEntity;

        device = await manager.findOne(DeviceEntity, {
            where: {
                title: title,
                user: user
            }
        })

        if (!device) {
            device = new DeviceEntity()
            device.createdAt = new Date()
            device.title = title
            device.user = user
            device.updatedAt = new Date()
        } else {
            device.updatedAt = new Date()
        }

        await manager.save(device)

        user.devices.push(device)

        await manager.save(user)

        return Result.Ok(device)
    }
}