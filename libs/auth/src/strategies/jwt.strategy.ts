import { settings_env } from '@app/common';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userQueryRepository: UserQueryRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: settings_env.JWT_SECRET || 'JWT_SECRET_KEY',
      usernameField: 'email',
    });
  }

  async validate(tokenData: any) {
    if (!tokenData) {
      throw new UnauthorizedException();
    }

    // TODO: write normal validate command, store pass in coolie??
    const user = await this.userQueryRepository.findUserById(tokenData.sub);
    if (!user || !user.emailConfirmed) {
      throw new UnauthorizedException();
    }

    return { ...user, deviceId: tokenData.deviceId };
  }
}