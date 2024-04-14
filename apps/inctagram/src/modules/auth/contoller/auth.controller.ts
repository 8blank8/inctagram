import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RegistrationUserUseCase } from "../use-cases/registration/registration-user.use-case";
import { RegistrationUserCommand } from "../use-cases/registration/dto/registration-user.command";
import { ResendConfirmationCodeCommand } from "../use-cases/confirmation/dto/resend-confirmation-code.command";
import { ResendConfirmationCodeUseCase } from "../use-cases/confirmation/resend-confirmation-code.use-case";
import { LoginUserCommand } from "../use-cases/login/dto/login.command";
import { LoginUserUseCase } from "../use-cases/login/login.use-case";
import { LoginUserDto } from "../dto/input/login-user.dto";
import { Request, Response } from "express";
import { ConfirmationUserCommand } from "../use-cases/confirmation/dto/confirmation-user.command";
import { ConfirmationUserUseCase } from "../use-cases/confirmation/confirmation-user.use-case";
import { SendRecoveryPasswordCodeCommand } from "../use-cases/recovery-password/dto/send-recovery-password-code.command";
import { SendRecoveryPasswordCodeUseCase } from "../use-cases/recovery-password/send-recovery-password-code.use-case";
import { ResetUserPasswordCommand } from "../use-cases/recovery-password/dto/reset-user-password.command";
import { ResetUserPasswordUseCase } from "../use-cases/recovery-password/reset-user-password.use-case";
import { JwtAuthGuard } from "../../../../../../libs/guards/jwt.guard";
import { LogoutUserUseCase } from "../use-cases/logout/logout-user.use-case";
import { LogoutUserCommand } from "../use-cases/logout/dto/logout-user.command";
import { ReqWithGoogleUser, ReqWithUser } from "@libs/types/req-with-user";
import { JwtRefreshAuthGuard } from "@libs/guards/refresh-token.guard";
import { RefreshTokenUseCase } from "../use-cases/refresh-token/refresh-token.use-case";
import { RefreshTokenCommand } from "../use-cases/refresh-token/dto/refresh-token.command";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserGoogleOauthUseCase } from "../../user/use-cases/create/create-user-google-ouath.use-case";
import { CreateUserGoogleOauthCommand } from "../../user/use-cases/create/dto/create-user-google-ouath.command";

@ApiTags('auth')
@Controller('auth')
export class AuthContoller {

    constructor(
        private registrationUserUseCase: RegistrationUserUseCase,
        private resendConfirmationCodeUseCase: ResendConfirmationCodeUseCase,
        private loginUserUseCase: LoginUserUseCase,
        private confirmationUserUseCase: ConfirmationUserUseCase,
        private sendRecoveryPasswordCodeUseCase: SendRecoveryPasswordCodeUseCase,
        private resetUserPasswordUseCase: ResetUserPasswordUseCase,
        private logoutUserUseCase: LogoutUserUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private createUserGoogleOauthUseCase: CreateUserGoogleOauthUseCase,
    ) { }

    @Post('/registration')
    async registration(
        @Body() dto: RegistrationUserCommand
    ) {
        return this.registrationUserUseCase.execute(dto)
    }

    @Post('/resend-email-code')
    async resendEmailCode(
        @Body() dto: ResendConfirmationCodeCommand
    ) {
        return this.resendConfirmationCodeUseCase.execute(dto)
    }

    @Post('/confirm-code')
    async confirmationCode(
        @Body() dto: ConfirmationUserCommand
    ) {
        return this.confirmationUserUseCase.execute(dto)
    }

    @Post('/login')
    async login(
        @Body() dto: LoginUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const command: LoginUserCommand = {
            ...dto,
            title: req.headers['user-agent']
        }

        const result = await this.loginUserUseCase.execute(command)
        if (!result.isSuccess) return res.status(HttpStatus.UNAUTHORIZED).send({
            resultCode: 1,
            data: {},
            errors: [result.err]
        })

        return res
            .cookie('refreshToken', result.value.refreshToken, { httpOnly: true, secure: true })
            .status(HttpStatus.CREATED)
            .send({
                resultCode: 0,
                data: { accessToken: result.value.accessToken },
                errors: []
            })
    }

    @Post('/password-recovery-email')
    async sendPasswordRecoveryCode(
        @Body() dto: SendRecoveryPasswordCodeCommand
    ) {
        return this.sendRecoveryPasswordCodeUseCase.execute(dto)
    }

    @Post('/change-password')
    async changePassword(
        @Body() dto: ResetUserPasswordCommand
    ) {
        return this.resetUserPasswordUseCase.execute(dto)
    }

    @UseGuards(JwtAuthGuard())
    @Post('/logout')
    async logout(
        @Req() req: ReqWithUser
    ) {
        const command: LogoutUserCommand = {
            deviceId: req.deviceId,
            userId: req.userId
        }
        return this.logoutUserUseCase.execute(command)
    }

    @UseGuards(JwtRefreshAuthGuard())
    @Get('/refresh-token')
    async refreshToken(
        @Req() req: ReqWithUser,
        @Res() res: Response
    ) {
        const command: RefreshTokenCommand = {
            deviceId: req.deviceId,
            userId: req.userId
        }

        const result = await this.refreshTokenUseCase.execute(command)

        if (!result.isSuccess) return res.status(HttpStatus.UNAUTHORIZED).send({
            resultCode: 1,
            data: {},
            errors: [result.err]
        })

        return res
            .cookie('refreshToken', result.value.refreshToken, { httpOnly: true, secure: true })
            .status(HttpStatus.CREATED)
            .send({
                resultCode: 0,
                data: { accessToken: result.value.accessToken },
                errors: []
            })
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: ReqWithGoogleUser) { }

    @Get('/google-redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(
        @Req() req: ReqWithGoogleUser,
        @Res() res: Response
    ) {
        const command: CreateUserGoogleOauthCommand = {
            email: req.user.email,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            userAgent: req.headers['user-agent']
        }

        const result = await this.createUserGoogleOauthUseCase.execute(command)
        if (!result.isSuccess) return res.status(HttpStatus.BAD_REQUEST).redirect(`${process.env.FRONT_URL}/`)

        return res
            .cookie('refreshToken', result.value.refreshToken, { httpOnly: true, secure: true })
            .status(HttpStatus.CREATED)
            .redirect(`${process.env.FRONT_URL}/`)
    }
}