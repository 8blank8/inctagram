import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceEntity } from "../../../../../../libs/infra/entities/device.entity";
import { Repository } from "typeorm";
import { Result } from "@libs/core/result";
import { DeviceViewDto } from "../dto/device-view.dto";
import { DeviceMapper } from "../mapper/device.mapper";


@Injectable()
export class DeviceQueryRepository {
    constructor(@InjectRepository(DeviceEntity) private deviceRepo: Repository<DeviceEntity>) { }

    async getDevicesByUserId(userId: string): Promise<Result<DeviceViewDto[]>> {
        const devices = await this.deviceRepo.find({
            where: {
                user: {
                    id: userId
                }
            }
        })

        return Result.Ok(devices.map(device => DeviceMapper.fromDeviceToDeviceViewDto(device)))
    }
}
