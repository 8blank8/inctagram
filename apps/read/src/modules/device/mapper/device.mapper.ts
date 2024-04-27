import { DeviceEntity } from "@libs/infra/entities/device.entity";
import { DeviceViewDto } from "../dto/device-view.dto";

export class DeviceMapper {
    static fromDeviceToDeviceViewDto(device: DeviceEntity): DeviceViewDto {
        return {
            id: device.id,
            ip: device.ip,
            title: device.title,
            createdAt: device.createdAt.toISOString(),
            updatedAt: device.updatedAt.toISOString()
        }
    }
}