import { Injectable } from "@nestjs/common";
import { CreateDeviceCommand } from "./dto/create-device.command";
import { DeviceEntity } from "../../../../../../../libs/infra/entities/device.entity";
import { Result } from "../../../../../../../libs/core/result";
import { EntityManager } from "typeorm";
import { UserEntity } from "@libs/infra/entities/user.entity";
import { UserNotFoundError } from "@libs/core/custom-error";


@Injectable()
export class CreateDeviceUseCase {
    async execute(command: CreateDeviceCommand, manager: EntityManager): Promise<Result<DeviceEntity>> {
        const { title, userId, ip } = command

        const user = await manager.findOne(UserEntity, {
            where: { id: userId },
            relations: { devices: true }
        })
        if (!user) return Result.Err(new UserNotFoundError())

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
            device.ip = ip
        } else {
            device.updatedAt = new Date()
        }

        await manager.save(device)

        user.devices.push(device)

        await manager.save(user)

        return Result.Ok(device)
    }
}