import { Injectable } from '@nestjs/common';
import { LogOutUserCommand } from './dto/logout-user.command';
import { DeleteDeviceUseCase } from '@app/main/security/use_cases/delete/delete-device.use-case';

@Injectable()
export class LogOutUserUseCase {
  constructor(private deleteDeviceUseCase: DeleteDeviceUseCase) {}

  async execute(command: LogOutUserCommand) {
    const { userId, deviceIdOrIp } = command;

    await this.deleteDeviceUseCase.execute({
      userId,
      deviceIdOrIp,
      compare: false,
    });

    return { message: 'Logged out.' };
  }
}
