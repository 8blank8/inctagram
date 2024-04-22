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
import { DeviceRepository } from '@inctagram/src/modules/device/repository/device.repository';


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
            private readonly deviceRepo: DeviceRepository
        ) { }

        async canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest();

            const refreshToken = ExtractJwt.fromCookieAsRefreshToken(req);

            try {
                if (!refreshToken)
                    throw new UnauthorizedException("Refresh token is not set");

                const { deviceId, userId, iat } = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET || '123' });
                req.userId = userId
                req.deviceId = deviceId

                const device = await this.deviceRepo.getDeviceById(deviceId)
                const createdTokenTime = iat.toString()
                const updatedDeviceTime = new Date(device.updatedAt).getTime().toString().slice(0, -3)

                if (createdTokenTime !== updatedDeviceTime) throw new UnauthorizedException('token is expired')

                return true;
            } catch (e) {
                console.log('auth err')
                throw new UnauthorizedException(e.message);
            }
        }

    }

    return mixin(Guard);
};
