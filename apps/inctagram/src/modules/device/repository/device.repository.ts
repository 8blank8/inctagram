import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceEntity } from "../entities/device.entity";
import { Repository } from "typeorm";


@Injectable()
export class DeviceRepository {
    constructor(@InjectRepository(DeviceEntity) private deviceRepo: Repository<DeviceEntity>) { }

    async getDeviceById(deviceId: string): Promise<DeviceEntity | null> {
        return this.deviceRepo.findOne({
            where: { id: deviceId },
            relations: { user: true }
        })
    }
}