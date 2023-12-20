import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { DeleteDeviceCommand } from '@app/main/security/use_cases/delete-device.use-case';

export class LogOutUserCommand {
  constructor(
    public userId: string,
    public deviceIdOrIp: string,
  ) {}
}

@CommandHandler(LogOutUserCommand)
export class LogOutUserUseCase {
  constructor(private commandBus: CommandBus) {}

  async execute(command: LogOutUserCommand) {
    const { userId, deviceIdOrIp } = command;
    await this.commandBus.execute(
      new DeleteDeviceCommand(userId, deviceIdOrIp, false),
    );

    return { message: 'Logged out.' };
  }
}
