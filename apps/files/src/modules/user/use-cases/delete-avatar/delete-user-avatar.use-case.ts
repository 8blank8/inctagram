import { Injectable } from "@nestjs/common";
import { DeleteUserAvatarCommand } from "./dto/delete-user-avatar.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { DataSource, EntityManager } from "typeorm";
import { UserRepository } from "../../repository/user.repository";
import { S3Service } from "@files/src/modules/s3/services/s3.service";
import { UserAvatarEntity } from "../../../../../../../libs/infra/entities/user-avatar.entity";


@Injectable()
export class DeleteUserAvatarUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
        private s3Service: S3Service
    ) { }

    async execute(command: DeleteUserAvatarCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { avatarId, userId }: DeleteUserAvatarCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {

            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err(`user with id: ${userId} not found`)
            if (!user.avatar) return Result.Err(`avatar id: ${avatarId} doesn't exist`)

            const isDelete = await this.s3Service.delete(user.avatar.url)
            if (!isDelete.isSuccess) return Result.Err('avatar not deleted')

            user.avatar = null
            await manager.save(user)

            const isDeleteUserAvatar = await manager.delete(UserAvatarEntity, { id: avatarId })
            if (isDeleteUserAvatar.affected !== 1) return Result.Err('user avatar not deleted')

            return Result.Ok()
        } catch (e) {
            console.log(e)
            return Result.Err('delete avatar for user something error}')
        }
    }
}