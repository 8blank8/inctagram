import { BaseEntity } from "../../../../../../libs/infra/entities/base.entity";
import { Column, Entity, ManyToOne, } from "typeorm";
import { AspectRatioType } from "../dto/create-post.dto";
import { PostEntity } from "./post.entity";


@Entity()
export class PostPhotoEntity extends BaseEntity {

    @Column({ type: 'float' })
    offsetX: number

    @Column({ type: 'float' })
    offsetY: number

    @Column({ type: 'float' })
    scale: number

    @Column({ type: 'enum', enum: AspectRatioType })
    aspectRatio: AspectRatioType

    @Column()
    url: string

    @ManyToOne(() => PostEntity, post => post.photos, { onDelete: 'CASCADE' })
    post: PostEntity
}

