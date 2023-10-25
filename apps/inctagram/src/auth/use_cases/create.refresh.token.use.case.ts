import { CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { settings_env } from '@app/common';
import { SecurityRepository } from '../../security/repository/security.repository';
import { SecurityQueryRepository } from '../../security/repository/secutity.query.repository';

export class CreateRefreshTokenCommand {
  constructor(
    public userId: string,
    public deviceId: string
  ) {}
}

@CommandHandler(CreateRefreshTokenCommand)
export class CreateRefreshTokenUseCase {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityRepository: SecurityRepository,
    private jwtService: JwtService
  ) {}

  async execute(command: CreateRefreshTokenCommand): Promise<string | boolean> {
    const { userId, deviceId } = command;

    const device = await this.securityQueryRepository.findDeviceById(deviceId);
    if (!device) return false;

    device.lastActiveDate = new Date();

    await this.securityRepository.saveDevice(device);
    // await this.securityRepository.updateLastActiveDate(new Date().toISOString(), device.id)
    // device.setLastActiveDate()
    // await this.securityRepository.saveDevice(device)

    const refreshToken = this.jwtService.sign(
      {
        userId: userId,
        deviceId: device.id,
      },
      {
        expiresIn: settings_env.JWT_REFRESH_EXP,
        secret: settings_env.JWT_SECRET,
      }
    );
    return refreshToken;
  }
}
