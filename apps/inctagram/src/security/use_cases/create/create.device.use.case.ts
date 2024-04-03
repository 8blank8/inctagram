import { Device } from '@prisma/client';
import { SecurityRepository } from '@app/main/security/repository/security.repository';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { CreateDeviceCommand } from './dto/create-device.command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateDeviceUseCase {
  constructor(
    private securityRepository: SecurityRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: CreateDeviceCommand): Promise<Device> {
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
