import { CommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../../repository/security.repository';
import { UserQueryRepository } from '../../../user/repository/user.query.repository';

export class CreateDeviceCommand {
  constructor(
    public userId: string,
    public ip: string,
    public title: string
  ) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase {
  constructor(
    private securityRepository: SecurityRepository,
    private userQueryRepository: UserQueryRepository
  ) {}

  async execute(command: CreateDeviceCommand): Promise<string | boolean> {
    const { userId, ip, title } = command;

    const user = await this.userQueryRepository.findUserById(userId);
    if (!user) return false;
    const device = {
      user: { connect: { id: user.id } },
      lastActiveDate: new Date().toISOString(),
      ip: ip,
      title: title,
    };
    const res = await this.securityRepository.saveDevice(device);
    return res.id;
  }
}
