import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { settings_env } from '@app/common';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private userQueryRepo: UserQueryRepository) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['refresh-token'];
      }
      return token
    };
    super({
      ignoreExpiration: false,
      secretOrKey: settings_env.JWT_REFRESH_SECRET || 'JWT_SECRET_KEY',
      jwtFromRequest: extractJwtFromCookie,
      usernameField: 'email',
    });
  }

  async validate(payload: any) {
    // const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (!payload) {
      throw new UnauthorizedException();
    }
    // TODO: write normal validate command, store pass in coolie??
    const user = await this.userQueryRepo.findUserById(payload.sub);

    if (!user || !user.emailConfirmed) {
      throw new UnauthorizedException();
    }
    return { ...user, deviceId: payload.deviceId };
  }
}
