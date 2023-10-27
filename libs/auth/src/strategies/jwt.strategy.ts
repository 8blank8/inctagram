import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUserCommand } from '@app/main/auth/use_cases/validate.user.use.case';
import { settings_env } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(username, password)
    const user = await this.commandBus.execute(
      new ValidateUserCommand(username, password),
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
