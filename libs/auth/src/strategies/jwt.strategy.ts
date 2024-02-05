import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { settings_env } from '@app/common';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';

interface TokenData {
  sub: string;
  deviceId: string;
  iat: number;
  exp: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userQueryRepository: UserQueryRepository) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    super({
      ignoreExpiration: false,
      secretOrKey: settings_env.JWT_SECRET || 'JWT_SECRET_KEY',
      jwtFromRequest: extractJwtFromCookie,
      usernameField: 'email',
    });
  }

  async validate(tokenData: TokenData): Promise<any> {
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
