import { appSetting } from "@libs/core/app-setting"
import { AvatarViewDto } from "../../../../../read/src/modules/user/dto/avatar-view.dto"
import { UserPfofileViewDto } from "../../../../../read/src/modules/user/dto/user-profile-view.dto"
import { UserEntity } from "../../../../../../libs/infra/entities/user.entity"
import { UserAvatarEntity } from "@libs/infra/entities/user-avatar.entity"

export class UserMapper {
    static fromUserToUserProfileViewDto(user: UserEntity): UserPfofileViewDto {
        return {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            aboutMe: user.aboutMe,
            dateOfBirth: user.dateOfBirth,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt === null ? null : user.updatedAt.toISOString(),
            avatar: UserMapper.fromAvatarToAvatarViewDto(user.avatar)
        }
    }

    static fromAvatarToAvatarViewDto(a: UserAvatarEntity): AvatarViewDto {
        let avatar: AvatarViewDto | null = null

        if (avatar) {
            avatar = {
                id: a.id,
                url: appSetting.AWS_S3_BASE_URL + a.url,
                offsetX: a.offsetX,
                offsetY: a.offsetY,
                scale: a.scale,
                createdAt: a.createdAt.toISOString(),
                updatedAt: a.updatedAt === null ? null : a.updatedAt.toISOString(),
            }
        }

        return avatar
    }
}