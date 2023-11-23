import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class SecurityRepository {
  constructor(private prisma: PrismaService) {}

  async saveDevice(device) {
    const { id, userId, ...data } = device;
    console.log(id);
    return this.prisma.device.upsert({
      where: {
        titleIpIdentifier: {
          ip: device.ip,
          title: device.title,
          userId: userId,
        },
      },
      update: data,
      create: data,
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
