import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostContoller } from "./controller/post.contoller";
import { PostQueryRepository } from "./repositories/post-query.repository";
import { PostPhotoEntity } from "@libs/infra/entities/post-photo.enitity";
import { PostEntity } from "@libs/infra/entities/post.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, PostPhotoEntity])
    ],
    controllers: [
        PostContoller
    ],
    providers: [
        PostQueryRepository
    ]
})
export class PostModule { }