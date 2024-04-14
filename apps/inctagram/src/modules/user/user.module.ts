import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserUseCase } from "./use-cases/create/create-user.use-case";
import { UserRepository } from "./repository/user.repository";
import { CreateUserGoogleOauthUseCase } from "./use-cases/create/create-user-google-ouath.use-case";
import { CreateDeviceUseCase } from "../device/use-cases/create/create-device.use-case";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [
        CreateUserUseCase,
        CreateUserGoogleOauthUseCase,
        CreateDeviceUseCase,
        UserRepository,
        JwtService
    ],
    exports: [
        CreateUserUseCase,
        CreateUserGoogleOauthUseCase,
        UserRepository
    ]
})
export class UserModule { }