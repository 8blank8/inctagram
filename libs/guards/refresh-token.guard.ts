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


export class ExtractJwt {

    static fromAuthHeaderAsBearerToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    static fromCookieAsRefreshToken(request: Request): string | undefined {
        const [title, token] = request.cookies?.refreshToken.split('=') ?? undefined
        return title === 'refreshToken' ? token : undefined
    }
}

export const JwtRefreshAuthGuard = (): any => {
    @Injectable()
    class Guard implements CanActivate {
        constructor(
            private readonly jwtService: JwtService,
        ) { }

        async canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest();

            const refreshToken = ExtractJwt.fromCookieAsRefreshToken(req);

            try {
                if (!refreshToken)
                    throw new UnauthorizedException("Refresh token is not set");

                const { userId, deviceId } = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET });

                req.userId = userId
                req.deviceId = deviceId

                return true;
            } catch (e) {
                console.log('auth err')
                throw new UnauthorizedException(e.message);
            }
        }

    }

    return mixin(Guard);
};
