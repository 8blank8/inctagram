import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { SecurityService } from '../application/security.service';
import { DeleteDeviceCommand } from '../application/use_cases/delete.device.use.case';
import { DeleteAllDevicesCommand } from '../application/use_cases/delete.all.device.use.case';
import { SecurityQueryRepository } from '../repository/secutity.query.repository';

@Controller('/security')
export class SecurityController {
  constructor(
    // private readonly securityQueryRepository: SecurityQueryRepository,
    private securityQueryRepository: SecurityQueryRepository,
    private securityService: SecurityService,
    private commandBus: CommandBus
  ) {}

  // @UseGuards(JwtRefreshTokenGuard)
  @Get('/devices')
  async findDevices(@Request() req) {
    const devices = this.securityQueryRepository.findDevicesUserByUserId(
      req.user.userId
    );
    return devices;
  }

  // @UseGuards(JwtRefreshTokenGuard)
  @Delete('/devices/:id')
  async deleteDeviceById(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response
  ) {
    const isDelete = await this.commandBus.execute(
      new DeleteDeviceCommand(id, req.user.userId)
    );
    if (!isDelete) return res.sendStatus(HttpStatus.NOT_FOUND);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  // @UseGuards(JwtRefreshTokenGuard)
  @Delete('/devices')
  async deleteAllDevices(@Request() req, @Res() res: Response) {
    await this.commandBus.execute(
      new DeleteAllDevicesCommand(req.user.userId, req.user.deviceId)
    );
    res.sendStatus(204);
  }
}
