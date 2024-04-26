import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { ReqWithUser } from "@libs/types/req-with-user";
import { Controller, Delete, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DeviceQueryRepository } from "../repository/device.query.repository";
import { DeleteDeviceCommand } from "../use-cases/delete/dto/delete-device.command";
import { DeleteDeviceUseCase } from "../use-cases/delete/delete-device.use-case";
import { DeleteDevicesUseCase } from "../use-cases/delete/delete-devices.use-case";
import { DeviceViewDto } from "../dtos/view/device-view.dto";

@ApiTags('devices')
@Controller('devices')
export class DeviceContoller {
    constructor(
        private deviceQueryRepo: DeviceQueryRepository,
        private deleteDeviceUseCase: DeleteDeviceUseCase,
        private deleteDevicesUseCase: DeleteDevicesUseCase,
    ) { }

    @ApiOkResponse({ type: DeviceViewDto, isArray: true })
    @UseGuards(JwtAuthGuard())
    @Get('')
    async getDevices(
        @Req() req: ReqWithUser
    ) {
        return this.deviceQueryRepo.getDevicesByUserId(req.userId)
    }

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