import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class SecurityRepository {
  constructor(
     private prisma: PrismaService
    ) {}

  async saveDevice(device) {
    const id: string = device.id ?? '';
    return this.prisma.device.upsert({
      where: { id: id },
      create: device,
      update: device,
    });
  }

  async deleteDeviceById(deviceId: string) {
    return this.prisma.device.delete({ where: { id: deviceId } });
  }

  async deleteAllDevicesByUserId(userId: string, deviceId: string) {
    return this.prisma.device.deleteMany({
      where: {
        id: { not: deviceId },
        userId: userId,
      },
    });
  }
}
