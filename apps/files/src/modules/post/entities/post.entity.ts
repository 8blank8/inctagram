import { BaseEntity } from "../../../../../../libs/infra/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "../../../../../inctagram/src/modules/user/entities/user.entity";
import { PostPhotoEntity } from "./post-photo.enitity";


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
