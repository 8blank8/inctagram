import { CommandHandler } from '@nestjs/cqrs';
import { Device } from '@prisma/client';
import { SecurityRepository } from '@app/main/security/repository/security.repository';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';

export class CreateDeviceCommand {
  constructor(
    public userId: string,
    public ip: string,
    public title: string,
    public date?: string,
  ) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase {
  constructor(
    private securityRepository: SecurityRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: CreateDeviceCommand): Promise<Device | boolean> {
    const { userId, ip, title, date } = command;

    const user = await this.userQueryRepository.findUserById(userId);
    if (!user) return null;
    const device = {
      user: { connect: { id: user.id } },
      lastActiveDate: date ?? new Date().toISOString(),
      ip: ip,
      userId: userId,
      title: title,
    };
    return await this.securityRepository.saveDevice(device);
  }
}
