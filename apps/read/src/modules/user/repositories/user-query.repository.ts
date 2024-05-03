import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../../../../libs/infra/entities/user.entity";
import { FindOneOptions, Repository } from "typeorm";
import { Result } from "@libs/core/result";
import { UserPfofileViewDto } from "../dto/user-profile-view.dto";
import { UserMapper } from "../mapper/user.mapper";


@Injectable()
export class UserQueryRepository {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async getUserProfileWithAvatar(userId: string, isAuth: boolean = false): Promise<Result<UserPfofileViewDto>> {

        const filter: FindOneOptions<UserEntity> = {
            where: {
                id: userId,

            },
            relations: {
                avatar: true
            }
        }

        if (!isAuth) filter.where['public'] = true

        const user = await this.userRepo.findOne(filter)
        if (!user) return Result.Err(`user with id: ${userId} not found`)

        return Result.Ok(UserMapper.fromUserToUserProfileViewDto(user))
    }

    async getTotalCountUsers(): Promise<Result<{ count: number }>> {
        try {
            const count = await this.userRepo.count()

            return Result.Ok({ count })
        } catch (e) {
            console.log(`${UserQueryRepository.name}, getTotalCountUsers error`, e)
            return Result.Err('some error')
        }
    }
}