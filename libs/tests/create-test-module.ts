import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { primaryPostgresConnectionOptions } from "../infra/postgres-ormconfig"
import { MailService } from "../mailer/mailer.service"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { CustomResultInterceptor } from "../interceptor/custom-result.interceptor"
import { JwtService } from "@nestjs/jwt"
import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity"
import { DeviceEntity } from "@inctagram/src/modules/device/entities/device.entity"
import { AuthContoller } from "@inctagram/src/modules/auth/contoller/auth.controller"
import { CreateUserUseCase } from "@inctagram/src/modules/user/use-cases/create/create-user.use-case"
import { RegistrationUserUseCase } from "@inctagram/src/modules/auth/use-cases/registration/registration-user.use-case"
import { ResendConfirmationCodeUseCase } from "@inctagram/src/modules/auth/use-cases/confirmation/resend-confirmation-code.use-case"
import { ConfirmationUserUseCase } from "@inctagram/src/modules/auth/use-cases/confirmation/confirmation-user.use-case"
import { SendRecoveryPasswordCodeUseCase } from "@inctagram/src/modules/auth/use-cases/recovery-password/send-recovery-password-code.use-case"
import { LoginUserUseCase } from "@inctagram/src/modules/auth/use-cases/login/login.use-case"
import { CreateDeviceUseCase } from "@inctagram/src/modules/device/use-cases/create/create-device.use-case"
import { ResetUserPasswordUseCase } from "@inctagram/src/modules/auth/use-cases/recovery-password/reset-user-password.use-case"
import { LogoutUserUseCase } from "@inctagram/src/modules/auth/use-cases/logout/logout-user.use-case"
import { RefreshTokenUseCase } from "@inctagram/src/modules/auth/use-cases/refresh-token/refresh-token.use-case"
import { CreateUserGoogleOauthUseCase } from "@inctagram/src/modules/user/use-cases/create/create-user-google-ouath.use-case"
import { UserRepository } from "@inctagram/src/modules/user/repository/user.repository"
import { DeviceRepository } from "@inctagram/src/modules/device/repository/device.repository"
import { AppModule } from "@inctagram/src/app.module"

export class MailServiceMock {
    async sendEmailConfirmationMessage(email: string, query: string): Promise<void> {
        console.log(email, query)
        return Promise.resolve();
    }

    async sendEmailPassRecovery(email: string, query: string): Promise<void> {
        console.log(email, query)
        return Promise.resolve();
    }
}

export const CreateTestModule = () => {
    return Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot(primaryPostgresConnectionOptions),
            TypeOrmModule.forFeature([
                UserEntity,
                DeviceEntity
            ])
        ],
        controllers: [
            AuthContoller,
        ],
        providers: [
            CreateUserUseCase,
            RegistrationUserUseCase,
            ResendConfirmationCodeUseCase,
            ConfirmationUserUseCase,
            SendRecoveryPasswordCodeUseCase,
            LoginUserUseCase,
            CreateDeviceUseCase,
            ResetUserPasswordUseCase,
            LogoutUserUseCase,
            RefreshTokenUseCase,
            CreateUserGoogleOauthUseCase,
            {
                provide: MailService,
                useClass: MailServiceMock,
            },
            {
                provide: APP_INTERCEPTOR,
                useClass: CustomResultInterceptor
            },
            UserRepository,
            DeviceRepository,
            JwtService,
        ]
    })
}

export const CreateModuleForControllerTest = () => {
    return Test.createTestingModule({
        imports: [AppModule],
    })
        .overrideProvider(MailService)
        .useClass(MailServiceMock)
}