import { UserRepository } from "@files/src/modules/user/repository/user.repository";
import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { PostRepository } from "../../repositories/post.repository";
import { DeletePostCommand } from "./dto/delete-post.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { S3Service } from "@files/src/modules/s3/services/s3.service";
import { NotOwnerError, PostNotFoundError, UserNotFoundError } from "@libs/core/custom-error";


@Injectable()
export class DeletePostUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
        private postRepo: PostRepository,
        private s3Service: S3Service
    ) { }

    async execute(command: DeletePostCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { postId, userId }: DeletePostCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {
            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err(new UserNotFoundError())

            const post = await this.postRepo.getPostById(postId)
            if (!post) return Result.Err(new PostNotFoundError())
            if (post.user.id !== userId) return Result.Err(new NotOwnerError('post'))

            for (let i = 0; i < post.photos.length; i++) {
                const url = post.photos[i].url

                await this.s3Service.delete(url)
            }

            await manager.remove(post)

            return Result.Ok()
        } catch (e) {
            console.log(`${DeletePostUseCase.name} some error`, e)
            return Result.Err(`${DeletePostUseCase.name} some error`)
        }
    }
}