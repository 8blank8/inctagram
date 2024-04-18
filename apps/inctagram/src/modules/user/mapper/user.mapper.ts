import { appSetting } from "@libs/core/app-setting"
import { AvatarViewDto } from "../dto/view/avatar-view.dto"
import { UserPfofileViewDto } from "../dto/view/user-profile-view.dto"
import { UserEntity } from "../entities/user.entity"

export class UserMapper {
    static fromUserToUserProfileViewDto(user: UserEntity): UserPfofileViewDto {

        let avatar: AvatarViewDto | null = null

        if (user.avatar) {
            avatar = {
                id: user.avatar.id,
                url: appSetting.AWS_S3_BASE_URL + user.avatar.url,
                offsetX: user.avatar.offsetX,
                offsetY: user.avatar.offsetY,
                scale: user.avatar.scale,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt === null ? null : user.updatedAt.toISOString(),
            }
        }

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
            avatar: avatar
        }
    }
}