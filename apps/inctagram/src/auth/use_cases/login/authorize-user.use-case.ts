import { JwtService } from '@nestjs/jwt';

import { AuthorizeUserCommand } from './dto/authorize-user.command';
import { Injectable } from '@nestjs/common';
import { CreateDeviceUseCase } from '@app/main/security/use_cases/create/create.device.use.case';
import { createTokens } from '@app/auth/tokens/create-tokens';

@Injectable()
export class AuthorizeUserUseCase {
  constructor(
    private jwtService: JwtService,
    private createDeviceUseCase: CreateDeviceUseCase,
  ) { }

  async execute(command: AuthorizeUserCommand) {
    const { userId, userAgent, ip } = command;

    const title = userAgent;

    const device = await this.createDeviceUseCase.execute({
      ip,
      title,
      userId,
      date: new Date().toISOString(),
    });

    const { accessToken, refreshToken } = await createTokens(this.jwtService, userId, device.id)

    return {
      accessToken,
      refreshToken,
    };
  }
}
