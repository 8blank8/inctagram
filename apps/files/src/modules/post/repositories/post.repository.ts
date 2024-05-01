import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "../../../../../../libs/infra/entities/post.entity";
import { Repository } from "typeorm";


@Injectable()
export class PostRepository {
    constructor(@InjectRepository(PostEntity) private postRepo: Repository<PostEntity>) { }

    async getPostById(postId: string): Promise<PostEntity | null> {
        return this.postRepo.findOne({
            where: { id: postId },
            relations: {
                user: true,
                photos: true
            }
        })
    }
}