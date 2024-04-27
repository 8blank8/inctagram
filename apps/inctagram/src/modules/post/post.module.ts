import { PostEntity } from "@files/src/modules/post/entities/post.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostContoller } from "./controller/post.contoller";
import { PostQueryRepository } from "./repositories/post-query.repository";
import { PostPhotoEntity } from "@files/src/modules/post/entities/post-photo.enitity";


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