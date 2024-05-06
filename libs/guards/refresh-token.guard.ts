import { config } from 'dotenv'
config()
import { Request } from "express";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    mixin,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenRepository } from '@inctagram/src/modules/auth/repositories/token.repository';


export class ExtractJwt {

    static fromAuthHeaderAsBearerToken(request: Request): string | undefined {
        if (!request.headers?.authorization) return undefined

        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    static fromCookieAsRefreshToken(request: Request): string | undefined {
        if (!request.cookies?.refreshToken) return undefined

        return request.cookies.refreshToken
    }
}

export const JwtRefreshAuthGuard = (): any => {
    @Injectable()
    class Guard implements CanActivate {
        constructor(
            private readonly jwtService: JwtService,
            private readonly tokenRepo: TokenRepository
        ) { }

        async canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest();

            const refreshToken = ExtractJwt.fromCookieAsRefreshToken(req);

            try {
                if (!refreshToken)
                    throw new UnauthorizedException("Refresh token is not set");

                const { deviceId, userId } = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET || '123' });
                req.userId = userId
                req.deviceId = deviceId

                const token = await this.tokenRepo.getTokenByToken(refreshToken)
                if (token) throw new UnauthorizedException('token is expired')

                return true;
            } catch (e) {
                throw new UnauthorizedException(e.message);
            }
        }

    }

    return mixin(Guard);
};
