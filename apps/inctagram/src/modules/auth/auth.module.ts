import { Module } from "@nestjs/common";
import { AuthContoller } from "./contoller/auth.controller";
import { UserModule } from "../user/user.module";
import { RegistrationUserUseCase } from "./use-cases/registration/registration-user.use-case";
import { MailService } from "../../../../../libs/mailer/mailer.service";
import { ResendConfirmationCodeUseCase } from "./use-cases/confirmation/resend-confirmation-code.use-case";
import { LoginUserUseCase } from "./use-cases/login/login.use-case";
import { CreateDeviceUseCase } from "../device/use-cases/create/create-device.use-case";
import { DeviceModule } from "../device/device.module";
import { ConfirmationUserUseCase } from "./use-cases/confirmation/confirmation-user.use-case";
import { SendRecoveryPasswordCodeUseCase } from "./use-cases/recovery-password/send-recovery-password-code.use-case";
import { ResetUserPasswordUseCase } from "./use-cases/recovery-password/reset-user-password.use-case";
import { JwtService } from "@nestjs/jwt";
import { LogoutUserUseCase } from "./use-cases/logout/logout-user.use-case";
import { RefreshTokenUseCase } from "./use-cases/refresh-token/refresh-token.use-case";
import { CreateUserGoogleOauthUseCase } from "../user/use-cases/create/create-user-google-ouath.use-case";


@Module({
    imports: [
        UserModule,
        DeviceModule,
    ],
    controllers: [AuthContoller],
    providers: [
        RegistrationUserUseCase,
        ResendConfirmationCodeUseCase,
        LoginUserUseCase,
        CreateDeviceUseCase,
        ConfirmationUserUseCase,
        SendRecoveryPasswordCodeUseCase,
        LogoutUserUseCase,
        ResetUserPasswordUseCase,
        RefreshTokenUseCase,
        CreateUserGoogleOauthUseCase,
        MailService,
        JwtService,
    ]
})
export class AuthModule { }