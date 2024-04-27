import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { CreatePostCommand } from "./dto/create-post.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { UserRepository } from "@files/src/modules/user/repository/user.repository";
import { PostPhotoEntity } from "../../../../../../../libs/infra/entities/post-photo.enitity";
import { PostEntity } from "../../../../../../../libs/infra/entities/post.entity";
import { AspectRatioType } from "../../dto/create-post.dto";
import { S3Service } from "@files/src/modules/s3/services/s3.service";
import { UserEntity } from "@libs/infra/entities/user.entity";


@Injectable()
export class CreatePostUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
        private s3Service: S3Service
    ) { }

    async execute(command: CreatePostCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        dto: CreatePostCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {
            const user = await this.userRepo.getUserById(dto.userId)
            if (!user) return Result.Err('user not found')

            const post = new PostEntity()
            post.createdAt = new Date()
            post.location = dto.location ?? null
            post.description = dto.description ?? null
            post.user = user

            const createdPost = await manager.save(post)

            const photos = this.createPostPhotosAndReturn(dto, createdPost, user)

            post.photos = photos

            await manager.save(photos)

            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i]
                const file = dto.files[i]

                const isUpload = await this.s3Service.upload(photo.url, file.buffer)
                if (!isUpload.isSuccess) return Result.Err(isUpload.err.message)
            }

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('create post some error')
        }
    }

    private createPostPhotosAndReturn(dto: CreatePostCommand, post: PostEntity, user: UserEntity) {
        const photos: PostPhotoEntity[] = []

        for (let i = 0; i < dto.files.length; i++) {
            const postPhoto = dto.files[i]

            const photo = new PostPhotoEntity()
            photo.createdAt = new Date()
            photo.aspectRatio = dto.aspectRatio[i] as AspectRatioType
            photo.offsetX = dto.offsetX[i]
            photo.offsetY = dto.offsetY[i]
            photo.scale = dto.scale[i]
            photo.post = post
            photo.url = this.createPostPhotoUrl(user.id, post.id, postPhoto.originalname)

            photos.push(photo)
        }

        return photos
    }

    private createPostPhotoUrl(userId: string, postId: string, fileName: string) {
        return `${userId}/posts/${[postId]}/${fileName}`
    }
}