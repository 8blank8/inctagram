import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, MoreThan, Repository } from "typeorm";
import { GetPostFilterDto } from "../filters/get-post.filter";
import { Result } from "@libs/core/result";
import { Paginated } from "@libs/core/pagination";
import { PostsViewDto } from "../dto/posts-view.dto";
import { PostMapper } from "../mapper/post.mapper";
import { PostEntity } from "@libs/infra/entities/post.entity";


@Injectable()
export class PostQueryRepository {
    constructor(
        @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>
    ) { }

    async getPosts(filter: GetPostFilterDto): Promise<Result<Paginated<PostsViewDto>>> {
        try {
            const { cursor, size, userId } = filter

            const filters: FindManyOptions<PostEntity> = {
                where: {
                    user: {
                        id: userId
                    }
                },
            }

            const posts = await this.postRepo.findAndCount({
                ...filters,
                relations: { photos: true },
                where: {
                    cursor: MoreThan(cursor)
                },
                order: { cursor: 'ASC' },
                take: size
            })


            return Result.Ok(
                Paginated.new({
                    count: posts[1],
                    size: size,
                    items: posts[0].map(p => PostMapper.fromPostToPostsViewDto(p))
                })
            )
        } catch (e) {
            console.log(e)
            return Result.Err('get posts some error')
        }
    }
}