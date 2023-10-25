import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { settings_env } from '@app/common';
import { SecurityQueryRepository } from '@app/main/security/repository/secutity.query.repository';
import { SecurityRepository } from '@app/main/security/repository/security.repository';
import { CreateDeviceCommand } from '@app/main/security/application/use_cases/create.device.use.case';

export class AuthorizeUserCommand {
  constructor(
    public userId: string,
    public ip: string,
    public title: string,
  ) {}
}

@CommandHandler(AuthorizeUserCommand)
export class AuthorizeUserUseCase {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
    private jwtService: JwtService,
    private commandBus: CommandBus,
  ) {}

  async execute(command: AuthorizeUserCommand) {
    const { userId, ip, title } = command;

    const device = await this.commandBus.execute(
      new CreateDeviceCommand(userId, ip, title, new Date().toISOString()),
    );

    return {
      accessToken: this.jwtService.sign(
        {
          userId: userId,
          deviceId: device.id,
        },
        {
          expiresIn: settings_env.JWT_ACCESS_EXP,
          secret: settings_env.JWT_SECRET,
        },
      ),
    };
  }
}
