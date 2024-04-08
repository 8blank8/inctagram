import { JwtService } from "@nestjs/jwt";
import { settings_env } from '@app/common';


export const createTokens = async (jwtService: JwtService, userId: string, deviceId: string) => {
    const [accessToken, refreshToken] = await Promise.all([
        jwtService.signAsync(
            {
                sub: userId,
                deviceId: deviceId,
            },
            {
                secret: settings_env.JWT_SECRET,
                expiresIn: settings_env.JWT_ACCESS_EXP,
            },
        ),
        jwtService.signAsync(
            {
                sub: userId,
                deviceId: deviceId,
            },
            {
                secret: settings_env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        ),
    ]);

    return {
        accessToken,
        refreshToken
    }
}