import { BaseEntity } from "../../../../../../libs/infra/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { PostPhotoEntity } from "./post-photo.enitity";
import { UserEntity } from "@libs/infra/entities/user.entity";


@Entity()
export class PostEntity extends BaseEntity {

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    location: string;

    @OneToMany(() => PostPhotoEntity, photo => photo.post, { onDelete: "CASCADE" })
    photos: PostPhotoEntity[];

    @ManyToOne(() => UserEntity, user => user.posts)
    user: UserEntity;
}
