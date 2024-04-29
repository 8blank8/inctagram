import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { UpdatePostCommand } from "./dto/update-post.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { UserRepository } from "@files/src/modules/user/repository/user.repository";
import { PostRepository } from "../../repositories/post.repository";


@Injectable()
export class UpdatePostUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
        private postRepo: PostRepository,
    ) { }

    async execute(command: UpdatePostCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { description, postId, userId }: UpdatePostCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {
            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err('user not found')

            const post = await this.postRepo.getPostById(postId)
            if (!post) return Result.Err('post not found')
            if (post.user.id !== userId) return Result.Err('user is not owner this post')

            post.description = description ?? null
            post.updatedAt = new Date()

            await manager.save(post)

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('update post some error')
        }
    }
}