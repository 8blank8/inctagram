import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { settings_env } from '@app/common';
import { CreateDeviceCommand } from '@app/main/security/application/use_cases/create.device.use.case';
import { Request } from 'express';

export class AuthorizeUserCommand {
  constructor(
    public userId: string,
    public req: Request,
  ) {}
}

@CommandHandler(AuthorizeUserCommand)
export class AuthorizeUserUseCase {
  constructor(
    private jwtService: JwtService,
    private commandBus: CommandBus,
  ) {}

  async execute(command: AuthorizeUserCommand) {
    const { userId, req } = command;
    const title = req.headers['user-agent'];
    const ip = req.headers['user-agent'];
    const device = await this.commandBus.execute(
      new CreateDeviceCommand(userId, ip, title, new Date().toISOString()),
    );
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
