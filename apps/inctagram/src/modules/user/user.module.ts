import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../../../libs/infra/entities/user.entity";
import { CreateUserUseCase } from "./use-cases/create/create-user.use-case";
import { UserRepository } from "./repository/user.repository";
import { CreateUserGoogleOauthUseCase } from "./use-cases/create/create-user-google-ouath.use-case";
import { CreateDeviceUseCase } from "../device/use-cases/create/create-device.use-case";
import { JwtService } from "@nestjs/jwt";
import { UpdateUserUseCase } from "./use-cases/update/update-user.use-case";
import { UserContoller } from "./controller/user.contoller";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [
        UserContoller
    ],
    providers: [
        CreateUserUseCase,
        CreateUserGoogleOauthUseCase,
        CreateDeviceUseCase,
        UpdateUserUseCase,
        UserRepository,
        JwtService,
    ],
    exports: [
        CreateUserUseCase,
        CreateUserGoogleOauthUseCase,
        UserRepository
    ]
})
export class UserModule { }