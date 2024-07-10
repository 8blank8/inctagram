import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, MoreThan, Repository } from "typeorm";
import { GetPostFilterDto } from "../filters/get-post.filter";
import { Result } from "@libs/core/result";
import { Paginated } from "@libs/core/pagination";
import { PostProfileViewDto } from "../dto/post-profile-view.dto";
import { PostMapper } from "../mapper/post.mapper";
import { PostEntity } from "@libs/infra/entities/post.entity";
import { PostForPublicViewDto } from "../dto/post-for-public-view.dto";
import { PostViewDto } from "../dto/post-view.dto";


@Injectable()
export class PostQueryRepository {
    constructor(
        @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>
    ) { }

    async getPosts(filter: GetPostFilterDto, userId: string | undefined): Promise<Result<Paginated<PostProfileViewDto>>> {
        try {
            const { cursor, size, userId } = filter

            const filters: FindManyOptions<PostEntity> = {
                where: {
                    user: {
                        id: userId
                    },
                    cursor: MoreThan(cursor),
                },
                relations: { photos: true },
            }

            if (!userId) filters.where['public'] = true

            const posts = await this.postRepo.find({
                ...filters,
                order: { cursor: 'ASC' },
                take: size
            })


            return Result.Ok(
                Paginated.new({
                    size: size,
                    items: posts.map(p => PostMapper.fromPostToPostProfileViewDto(p))
                })
            )
        } catch (e) {
            console.log(`${PostQueryRepository.name, this.getPosts.name} some error`, e)
            return Result.Err(`${PostQueryRepository.name, this.getPosts.name} some error`)
        }
    }

    async getPublicPosts(): Promise<Result<PostForPublicViewDto[]>> {
        try {

            const posts = await this.postRepo.find({
                where: {
                    public: true
                },
                relations: {
                    user: {
                        avatar: true
                    },
                    photos: true,
                },
                order: { createdAt: 'DESC' },
                take: 4
            })

            return Result.Ok(
                posts.map(p => PostMapper.fromPostToPostPublicViewDto(p))
            )

        } catch (e) {
            console.log(`${PostQueryRepository.name, this.getPublicPosts.name} some error`, e)
            return Result.Err(`${PostQueryRepository.name, this.getPublicPosts.name} some error`)
        }
    }

    async getPostById(postId: string): Promise<Result<PostViewDto>> {
        try {
            const post = await this.postRepo.findOne({
                where: {
                    id: postId,
                    public: true
                },
                relations: {
                    user: {
                        avatar: true
                    },
                    photos: true
                }
            })

            if (!post) return Result.Ok(null)
            return Result.Ok(PostMapper.fromPostToPostViewDto(post))

        } catch (e) {
            console.log(`${PostQueryRepository.name, this.getPostById.name} some error`, e)
            return Result.Err(`${PostQueryRepository.name, this.getPostById.name} some error`)
        }
    }

}