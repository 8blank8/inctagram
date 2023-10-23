import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { JwtRefreshTokenGuard } from '../../auth/guards/jwt.refresh.token.guard';
import { SecurityService } from '../application/security.service';
import { STATUS_CODE } from '../../../entity/enum/status.code';
import { DeleteDeviceCommand } from '../application/use_cases/delete.device.use.case';
import { DeleteAllDevicesCommand } from '../application/use_cases/delete.all.device.use.case';
import { SecurityQueryRepositoryTypeorm } from '../infrastructure/secutity.query.repository.typeorm';

@Controller('/security')
export class SecurityController {
  constructor(
    // private readonly securityQueryRepository: SecurityQueryRepository,
    private securityQueryRepository: SecurityQueryRepositoryTypeorm,
    private securityService: SecurityService,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtRefreshTokenGuard)
  @Get('/devices')
  async findDevices(@Request() req) {
    const devices = this.securityQueryRepository.findDevicesUserByUserId(
      req.user.userId,
    );
    return devices;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Delete('/devices/:id')
  async deleteDeviceById(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const isDelete = await this.commandBus.execute(
      new DeleteDeviceCommand(id, req.user.userId),
    );
    if (!isDelete) return res.sendStatus(STATUS_CODE.NOT_FOUND);

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Delete('/devices')
  async deleteAllDevices(@Request() req, @Res() res: Response) {
    await this.commandBus.execute(
      new DeleteAllDevicesCommand(req.user.userId, req.user.deviceId),
    );
    res.sendStatus(204);
  }
}
