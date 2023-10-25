import { CommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../../repository/security.repository';

export class DeleteAllDevicesCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteAllDevicesCommand)
export class DeleteAllDevicesUseCase {
  constructor(private securityRepository: SecurityRepository) {}

  async execute(command: DeleteAllDevicesCommand) {
    const { userId, deviceId } = command;

    return await this.securityRepository.deleteAllDevicesByUserId(
      userId,
      deviceId,
    );
  }
}
