import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { Device } from '@prisma/client';


@Injectable()
export class SecurityQueryRepository {
  constructor(
     private prisma: PrismaService
    ) {}

  async findDeviceById(deviceId: string): Promise<Device | null> {

    const device = await this.prisma.device.findFirst({
      where: {id: deviceId}
    })

    return device;
  }

  async findDevicesUserByUserId(userId: string): Promise<Device[] > {

    const devices = await this.prisma.device.findMany({
      where: {userId: userId}
    })

    return devices;
  }

  // private _mapDeviceView(device: Devices): DeviceViewSqlModel {
  //   return {
  //     deviceId: device.id,
  //     ip: device.ip,
  //     lastActiveDate: device.lastActiveDate,
  //     title: device.title,
  //   };
  // }
}
