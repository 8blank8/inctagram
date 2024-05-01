import { PostEntity } from "@libs/infra/entities/post.entity";
import { PostProfileViewDto } from "../dto/post-profile-view.dto";
import { PostForPublicViewDto } from "../dto/post-for-public-view.dto";
import { UserMapper } from "../../user/mapper/user.mapper";
import { appSetting } from "@libs/core/app-setting";
import { PostViewDto } from "../dto/post-view.dto";
import { PostPhotoEntity } from "@libs/infra/entities/post-photo.enitity";
import { PostPhotoViewDto } from "../dto/post-photo-view.dto";


export class PostMapper {

    static fromPostPhotoToPostPhotoViewDto(photo: PostPhotoEntity): PostPhotoViewDto {
        return {
            url: appSetting.AWS_S3_BASE_URL + photo.url,
            aspectRatio: photo.aspectRatio,
            offsetX: photo.offsetX,
            offsetY: photo.offsetY,
            scale: photo.scale,
        }
    }

    static fromPostToPostProfileViewDto(post: PostEntity): PostProfileViewDto {
        return {
            id: post.id,
            cursor: post.cursor,
            photo: PostMapper.fromPostPhotoToPostPhotoViewDto(post.photos[0])
        }
    }

    static fromPostToPostPublicViewDto(post: PostEntity): PostForPublicViewDto {
        return {
            id: post.id,
            createdAt: post.createdAt.toISOString(),
            description: post.description,
            user: {
                id: post.user.id,
                username: post.user.username,
                avatar: UserMapper.fromAvatarToAvatarViewDto(post.user.avatar)
            },
            photos: post.photos.map(photo => PostMapper.fromPostPhotoToPostPhotoViewDto(photo)),
        }
    }

    static fromPostToPostViewDto(post: PostEntity): PostViewDto {
        return {
            id: post.id,
            createdAt: post.createdAt.toISOString(),
            description: post.description,
            user: {
                id: post.user.id,
                username: post.user.username,
                avatar: UserMapper.fromAvatarToAvatarViewDto(post.user.avatar)
            },
            photos: post.photos.map(photo => PostMapper.fromPostPhotoToPostPhotoViewDto(photo)),
        }
    }
}