import { Injectable } from "@nestjs/common";
import { CreateUserAvatarCommand } from "./dto/create-user-avatar.command";
import { UserRepository } from "../../repository/user.repository";
import { Result } from "@libs/core/result";
import { UserAvatarEntity } from "../../../../../../../libs/infra/entities/user-avatar.entity";
import { DataSource, EntityManager } from "typeorm";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { IdCreated } from "@libs/core/id-created";
import { S3Service } from "@files/src/modules/s3/services/s3.service";
import { AvatarNotDeletedError, UserWithIdNotFoundError } from "@libs/core/custom-error";


@Injectable()
export class CreateUserAvatarUseCase {

    constructor(
        private userRepo: UserRepository,
        private dataSource: DataSource,
        private s3Service: S3Service
    ) { }

    async execute(command: CreateUserAvatarCommand): Promise<Result<IdCreated>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { dto, file, userId }: CreateUserAvatarCommand,
        manager: EntityManager
    ): Promise<Result<IdCreated>> {
        try {
            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err(new UserWithIdNotFoundError(userId))

            if (user.avatar) {
                const isDelete = await this.s3Service.delete(user.avatar.url)
                if (!isDelete.isSuccess) return Result.Err(isDelete.err.message)

                const currentAvatarId = user.avatar.id

                user.avatar = null
                const userWithNonAvatar = await manager.save(user)
                if (userWithNonAvatar.avatar) return Result.Err(new AvatarNotDeletedError())

                const isDeleteUserAvatar = await manager.delete(UserAvatarEntity, currentAvatarId)
                if (isDeleteUserAvatar.affected !== 1) return Result.Err(new AvatarNotDeletedError())
            }

            const avatarUrl = this.createUrl(user.id, file.originalname)

            const isUpload = await this.s3Service.upload(avatarUrl, file.buffer)
            if (!isUpload.isSuccess) return Result.Err(isUpload.err.message)

            const avatar = new UserAvatarEntity()
            avatar.createdAt = new Date()
            avatar.offsetX = dto.offsetX
            avatar.offsetY = dto.offsetY
            avatar.scale = dto.scale
            avatar.user = user
            avatar.url = avatarUrl

            const createdAvatar = await manager.save(avatar)

            user.avatar = createdAvatar
            await manager.save(user)

            return Result.Ok({ id: createdAvatar.id })
        } catch (e) {
            console.log(`${CreateUserAvatarUseCase.name} some error`, e)
            return Result.Err(`${CreateUserAvatarUseCase.name} some error`)
        }
    }

    private createUrl(userId: string, fileName: string) {
        return `${userId}/avatar/${fileName}`
    }
}