import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { ReqWithUser } from "@libs/types/req-with-user";
import { Controller, Delete, Param, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteDeviceCommand } from "../use-cases/delete/dto/delete-device.command";
import { DeleteDeviceUseCase } from "../use-cases/delete/delete-device.use-case";
import { DeleteDevicesUseCase } from "../use-cases/delete/delete-devices.use-case";

@ApiTags('devices')
@Controller('devices')
export class DeviceContoller {
    constructor(
        private deleteDeviceUseCase: DeleteDeviceUseCase,
        private deleteDevicesUseCase: DeleteDevicesUseCase,
    ) { }

    @UseGuards(JwtAuthGuard())
    @Delete('/:id')
    async deleteDevice(
        @Req() req: ReqWithUser,
        @Param('id') id: string
    ) {
        const command: DeleteDeviceCommand = {
            deviceId: id,
            userId: req.userId
        }

        return this.deleteDeviceUseCase.execute(command)
    }

    @UseGuards(JwtAuthGuard())
    @Delete('')
    async deleteDevices(
        @Req() req: ReqWithUser,
    ) {
        const command: DeleteDeviceCommand = {
            deviceId: req.deviceId,
            userId: req.userId
        }

        return this.deleteDevicesUseCase.execute(command)
    }
}