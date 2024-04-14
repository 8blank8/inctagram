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
import { ExtractJwt } from './refresh-token.guard';


export const JwtAuthGuard = (): any => {
    @Injectable()
    class Guard implements CanActivate {
        constructor(
            private readonly jwtService: JwtService,
        ) { }

        async canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest();

            const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken(req);

            try {
                if (!accessToken)
                    throw new UnauthorizedException("Access token is not set");

                const { userId, deviceId } = await this.jwtService.verifyAsync(accessToken, { secret: process.env.JWT_SECRET });

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
