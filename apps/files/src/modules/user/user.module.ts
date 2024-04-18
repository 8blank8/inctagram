import { Module } from "@nestjs/common";
import { UserContoller } from "./contoller/user.contoller";
import { CreateUserAvatarUseCase } from "./use-cases/create-avatar/create-user-avatar.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./repository/user.repository";
import { JwtService } from "@nestjs/jwt";
import { UserAvatarEntity } from "./entities/user-avatar.entity";
import { UserEntity } from "@inctagram/src/modules/user/entities/user.entity";
import { S3Module } from "../s3/s3.module";
import { DeleteUserAvatarUseCase } from "./use-cases/delete-avatar/delete-user-avatar.use-case";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserAvatarEntity, UserEntity]),
        S3Module
    ],
    controllers: [UserContoller],
    providers: [
        CreateUserAvatarUseCase,
        DeleteUserAvatarUseCase,
        UserRepository,
        JwtService,
    ]
})
export class UserModule { }