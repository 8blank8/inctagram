import { JwtService } from "@nestjs/jwt";
import { appSetting } from '@libs/core/app-setting';


export const createJwtTokens = async (jwtService: JwtService, userId: string, deviceId: string): Promise<{ accessToken: string, refreshToken: string }> => {
    const [accessToken, refreshToken] = await Promise.all([
        jwtService.signAsync(
            {
                userId: userId,
                deviceId: deviceId,
            },
            {
                secret: appSetting.JWT_SECRET,
                expiresIn: appSetting.JWT_ACCESS_EXP,
            },
        ),
        jwtService.signAsync(
            {
                userId: userId,
                deviceId: deviceId,
            },
            {
                secret: appSetting.JWT_REFRESH_SECRET,
                expiresIn: appSetting.JWT_REFRESH_EXP,
            },
        ),
    ]);

    return {
        accessToken,
        refreshToken
    }
}
