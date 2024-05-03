import { PostPhotoEntity } from "./post-photo.enitity";
import { Column, Entity, Generated, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";


@Entity()
export class PostEntity extends BaseEntity {

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    location: string;

    @Column()
    @Generated('increment')
    cursor: number

    @Column({ default: true })
    public: boolean

    @OneToMany(() => PostPhotoEntity, photo => photo.post, { onDelete: "CASCADE" })
    photos: PostPhotoEntity[];

    @ManyToOne(() => UserEntity, user => user.posts)
    user: UserEntity;
}
