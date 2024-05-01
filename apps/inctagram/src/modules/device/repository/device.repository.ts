import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceEntity } from "../../../../../../libs/infra/entities/device.entity";
import { Not, Repository } from "typeorm";


@Injectable()
export class DeviceRepository {
    constructor(@InjectRepository(DeviceEntity) private deviceRepo: Repository<DeviceEntity>) { }

    async getDeviceById(deviceId: string): Promise<DeviceEntity | null> {
        return this.deviceRepo.findOne({
            where: { id: deviceId },
            relations: { user: true }
        })
    }

    async getDevicesExceptCurrentUser(userId: string, deviceId: string): Promise<DeviceEntity[]> {
        return this.deviceRepo.find({
            where: {
                id: Not(deviceId),
                user: {
                    id: userId
                }
            }
        })
    }
}