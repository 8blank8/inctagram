import { Module } from "@nestjs/common";
import { PostContoller } from "./contoller/post.contoller";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { CreatePostUseCase } from "./use-cases/create/create-post.use-case";
import { S3Module } from "../s3/s3.module";
import { PostRepository } from "./repositories/post.repository";
import { UpdatePostUseCase } from "./use-cases/update/update-post.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "../../../../../libs/infra/entities/post.entity";
import { PostPhotoEntity } from "../../../../../libs/infra/entities/post-photo.enitity";
import { DeletePostUseCase } from "./use-cases/delete/delete-post.use-case";


@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, PostPhotoEntity]),
        UserModule,
        S3Module
    ],
    controllers: [
        PostContoller,
    ],
    providers: [
        JwtService,
        CreatePostUseCase,
        UpdatePostUseCase,
        DeletePostUseCase,
        PostRepository,
    ]
})
export class PostModule { }