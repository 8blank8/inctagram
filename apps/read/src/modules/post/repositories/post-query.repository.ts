import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
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
            const { page, size, userId } = filter

            const filters: FindManyOptions<PostEntity> = {
                where: {
                    user: {
                        id: userId
                    }
                },
            }

            const posts = await this.postRepo.find({
                ...filters,
                relations: { photos: true },
                skip: page * size,
                take: size
            })

            const totalCount = await this.postRepo.count(filters)

            return Result.Ok(
                Paginated.new({
                    count: totalCount,
                    page: page,
                    size: size,
                    items: posts.map(p => PostMapper.fromPostToPostsViewDto(p))
                })
            )
        } catch (e) {
            console.log(e)
            return Result.Err('get posts some error')
        }
    }
}