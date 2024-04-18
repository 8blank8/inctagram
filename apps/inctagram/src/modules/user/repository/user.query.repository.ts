import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { Result } from "@libs/core/result";
import { UserPfofileViewDto } from "../dto/view/user-profile-view.dto";
import { UserMapper } from "../mapper/user.mapper";


@Injectable()
export class UserQueryRepository {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async getUserProfileWithAvatar(userId: string): Promise<Result<UserPfofileViewDto>> {
        const user = await this.userRepo.findOneBy({ id: userId })
        if (!user) return Result.Err(`user with id: ${userId} not found`)

        return Result.Ok(UserMapper.fromUserToUserProfileViewDto(user))
    }
}