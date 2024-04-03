import { JwtService } from '@nestjs/jwt';

import { settings_env } from '@app/common';
import { AuthorizeUserCommand } from './dto/authorize-user.command';
import { Injectable } from '@nestjs/common';
import { CreateDeviceUseCase } from '@app/main/security/use_cases/create/create.device.use.case';

@Injectable()
export class AuthorizeUserUseCase {
  constructor(
    private jwtService: JwtService,
    private createDeviceUseCase: CreateDeviceUseCase,
  ) {}

  async execute(command: AuthorizeUserCommand) {
    const { userId, userAgent, ip } = command;

    const title = userAgent;

    const device = await this.createDeviceUseCase.execute({
      ip,
      title,
      userId,
      date: new Date().toISOString(),
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          deviceId: device.id,
        },
        {
          secret: settings_env.JWT_SECRET,
          expiresIn: settings_env.JWT_ACCESS_EXP,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          deviceId: device.id,
        },
        {
          secret: settings_env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
