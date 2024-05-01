import { PostEntity } from "@libs/infra/entities/post.entity";
import { PostsViewDto } from "../dto/posts-view.dto";
import { PostsForPublicViewDto } from "../dto/posts-for-public-view.dto";
import { UserMapper } from "../../user/mapper/user.mapper";
import { appSetting } from "@libs/core/app-setting";


export class PostMapper {
    static fromPostToPostsViewDto(post: PostEntity): PostsViewDto[] {

        return post.photos.map(p => {
            return {
                postId: post.id,
                url: appSetting.AWS_S3_BASE_URL + p.url,
                aspectRatio: p.aspectRatio,
                offsetX: p.offsetX,
                offsetY: p.offsetY,
                scale: p.scale,
                cursor: post.cursor
            }
        })
    }

    static fromPostToPublicPostViewDto(post: PostEntity): PostsForPublicViewDto {
        return {
            id: post.id,
            createdAt: post.createdAt.toISOString(),
            description: post.description,
            user: {
                id: post.user.id,
                username: post.user.username,
                avatar: UserMapper.fromAvatarToAvatarViewDto(post.user.avatar)
            },
            photos: PostMapper.fromPostToPostsViewDto(post),
        }
    }
}