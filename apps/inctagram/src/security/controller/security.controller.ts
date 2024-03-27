import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SecurityQueryRepository } from '@app/main/security/repository/secutity-query.repository';
import { DeleteDeviceCommand } from '@app/main/security/use_cases/delete-device.use-case';
import { DeleteAllDevicesCommand } from '@app/main/security/use_cases/delete.all.device.use.case';
import { JwtAuthGuard } from '@app/auth';
import { DeviceEntity } from '@app/main/security/entity/device.entity';
import {
  ForbiddenApiResponse,
  OkApiResponse,
} from '../../../../../libs/swagger/swagger.decorator';

@ApiBearerAuth()
@ApiTags('security')
@Controller('/security')
export class SecurityController {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private commandBus: CommandBus,
  ) { }

  @ForbiddenApiResponse()
  @OkApiResponse(DeviceEntity, '', true)
  @UseGuards(JwtAuthGuard)
  @Get('/devices')
  async findDevices(@Request() req) {
    const devices = this.securityQueryRepository.findDevicesUserByUserId(
      req.user.userId,
    );
    return devices;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/devices/:id')
  async deleteDeviceById(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const isDelete = await this.commandBus.execute(
      new DeleteDeviceCommand(req.user.userId, id),
    );
    if (!isDelete) return res.sendStatus(HttpStatus.NOT_FOUND);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/devices')
  async deleteAllDevices(@Request() req, @Res() res: Response) {
    await this.commandBus.execute(
      new DeleteAllDevicesCommand(req.user.id, req.user.deviceId),
    );
    res.sendStatus(204);
  }
}
