import { PostEntity } from "@files/src/modules/post/entities/post.entity";
import { PostsViewDto } from "../dto/posts-view.dto";


export class PostMapper {
    static fromPostToPostsViewDto(post: PostEntity): PostsViewDto {
        return {
            id: post.id,
            url: post.photos[0].url
        }
    }
}