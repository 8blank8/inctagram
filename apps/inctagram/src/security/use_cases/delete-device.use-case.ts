import { CommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { SecurityQueryRepository } from '@app/main/security/repository/secutity-query.repository';
import { SecurityRepository } from '@app/main/security/repository/security.repository';

export class DeleteDeviceCommand {
  constructor(
    public userId: string,
    public deviceIdOrIp: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase {
  constructor(
    private securityRepository: SecurityRepository,
    private securityQueryRepository: SecurityQueryRepository,
  ) {}

  async execute(command: DeleteDeviceCommand): Promise<boolean> {
    const { deviceIdOrIp, userId } = command;

    const device =
      await this.securityQueryRepository.findDeviceById(deviceIdOrIp);
    if (!device) return false;

    if (device.userId !== userId) throw new ForbiddenException();

    await this.securityRepository.deleteDeviceById(device.id);

    return true;
  }
}
