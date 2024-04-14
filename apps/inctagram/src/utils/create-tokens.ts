import { config } from 'dotenv'
config()
import { JwtService } from "@nestjs/jwt";


export const createJwtTokens = async (jwtService: JwtService, userId: string, deviceId: string) => {
    const [accessToken, refreshToken] = await Promise.all([
        jwtService.signAsync(
            {
                userId: userId,
                deviceId: deviceId,
            },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_ACCESS_EXP,
            },
        ),
        jwtService.signAsync(
            {
                userId: userId,
                deviceId: deviceId,
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.JWT_REFRESH_EXP,
            },
        ),
    ]);

    return {
        accessToken,
        refreshToken
    }
}