import { BaseEntity } from "./base.entity";
import { Column, Entity, Generated, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { PostPhotoEntity } from "./post-photo.enitity";


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
