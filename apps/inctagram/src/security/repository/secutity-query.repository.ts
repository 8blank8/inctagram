import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { Device } from '@prisma/client';
import { deviceSelect } from '@app/main/security/entity/device.entity';

@Injectable()
export class SecurityQueryRepository {
  constructor(private prisma: PrismaService) {}

  async findDeviceById(deviceIdOrIp: string): Promise<Device | null> {
    return this.prisma.device.findFirst({
      where: {
        OR: [{ id: deviceIdOrIp }, { ip: deviceIdOrIp }],
      },
    });
  }

  async findDevicesUserByUserId(userId: string) {
    const devices = await this.prisma.device.findMany({
      where: { userId: userId },
      select: deviceSelect,
    });

    return devices;
  }
}
