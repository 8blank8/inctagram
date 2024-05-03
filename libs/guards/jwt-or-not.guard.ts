import { config } from 'dotenv'
config()
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    mixin,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ExtractJwt } from './refresh-token.guard';


export const JwtOrNotAuthGuard = (): any => {
    @Injectable()
    class Guard implements CanActivate {
        constructor(
            private readonly jwtService: JwtService,
        ) { }

        async canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest();

            const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken(req);

            try {
                if (!accessToken) {
                    req.userId = null
                    req.deviceId = null

                    return true
                }


                const { userId, deviceId } = await this.jwtService.verifyAsync(accessToken, { secret: process.env.JWT_SECRET || '123' });

                req.userId = userId
                req.deviceId = deviceId

                return true;
            } catch (e) {
                throw new UnauthorizedException(e.message);
            }
        }

    }

    return mixin(Guard);
};
