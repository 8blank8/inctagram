import { DeviceViewDto } from "../dtos/view/device-view.dto";
import { DeviceEntity } from "../entities/device.entity";

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