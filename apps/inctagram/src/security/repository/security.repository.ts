import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class SecurityRepository {
  constructor(private prisma: PrismaService) {}

  async saveDevice(device) {
    const { id, ...data } = device;
    if (!id) return this.prisma.device.create({ data: data });
    return this.prisma.device.update({
      where: { id: id },
      data,
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
