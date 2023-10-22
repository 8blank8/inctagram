import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@app/db';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject() private prisma: PrismaService) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'JWT_SECRET_KEY',
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findFirst({
      where: { id: Number(payload.sub) },
    });

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
