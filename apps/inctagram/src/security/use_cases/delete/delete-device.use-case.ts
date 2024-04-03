import { ForbiddenException, Injectable } from '@nestjs/common';
import { SecurityQueryRepository } from '@app/main/security/repository/secutity-query.repository';
import { SecurityRepository } from '@app/main/security/repository/security.repository';
import { DeleteDeviceCommand } from './dto/delete-device.command';

@Injectable()
export class DeleteDeviceUseCase {
  constructor(
    private securityRepository: SecurityRepository,
    private securityQueryRepository: SecurityQueryRepository,
  ) {}

  async execute(command: DeleteDeviceCommand): Promise<boolean> {
    const { deviceIdOrIp, userId, compare = true } = command;

    const device =
      await this.securityQueryRepository.findDeviceById(deviceIdOrIp);
    if (!device) return false;
    if (compare && device.userId !== userId) throw new ForbiddenException();

    await this.securityRepository.deleteDeviceById(device.id);

    return true;
  }
}
