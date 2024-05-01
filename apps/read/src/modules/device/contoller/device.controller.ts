import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { ReqWithUser } from "@libs/types/req-with-user";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DeviceViewDto } from "../dto/device-view.dto";
import { DeviceQueryRepository } from "../repositories/device-query.repository";

@ApiTags('devices')
@Controller('devices')
export class DeviceContoller {
    constructor(
        private deviceQueryRepo: DeviceQueryRepository,
    ) { }

    @ApiOkResponse({ type: DeviceViewDto, isArray: true })
    @UseGuards(JwtAuthGuard())
    @Get('')
    async getDevices(
        @Req() req: ReqWithUser
    ) {
        return this.deviceQueryRepo.getDevicesByUserId(req.userId)
    }
}