import { PostEntity } from "@libs/infra/entities/post.entity";
import { PostsViewDto } from "../dto/posts-view.dto";


export class PostMapper {
    static fromPostToPostsViewDto(post: PostEntity): PostsViewDto {
        return {
            id: post.id,
            url: post.photos[0].url,
            cursor: post.cursor
        }
    }
}