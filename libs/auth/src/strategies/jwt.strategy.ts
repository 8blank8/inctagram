import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { settings_env } from '@app/common';
import { ValidateUserCommand } from '@app/main/auth/use_cases/validate.user.use.case';

export type JwtPayload = {
  email: string;
  password: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private commandBus: CommandBus) {
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
    });
  }

  async validate({ email, password }: JwtPayload) {
    const user = await this.commandBus.execute(
      new ValidateUserCommand(email, password)
    );

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: user.id,
      email: email,
    };
  }
}
