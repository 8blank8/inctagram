import { Module } from "@nestjs/common";
import { UserContoller } from "./contoller/user.contoller";
import { UserQueryRepository } from "./repositories/user-query.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@libs/infra/entities/user.entity";
import { JwtService } from "@nestjs/jwt";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [
        UserContoller
    ],
    providers: [
        UserQueryRepository,
        JwtService
    ]
})
export class UserModule { }