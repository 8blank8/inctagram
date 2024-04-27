import { BaseEntity } from "./base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { UserAvatarEntity } from "./user-avatar.entity";
import { PostEntity } from "./post.entity";


@Entity()
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    username: string

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    aboutMe: string | null

    @Column({ type: 'timestamp without time zone', nullable: true, default: null })
    dateOfBirth: Date | null

    @Column({ default: false })
    emailConfirmed: boolean

    @Column({ nullable: true })
    confirmationCode: string | null

    @Column({ nullable: true })
    passwordRecoveryCode: string | null

    @Column({ nullable: true })
    passwordSalt: string | null

    @Column({ nullable: true })
    passwordHash: string | null

    @OneToMany(() => DeviceEntity, device => device.user)
    devices: DeviceEntity[]

    @OneToOne(() => UserAvatarEntity, avatar => avatar.user, { nullable: true })
    @JoinColumn()
    avatar: UserAvatarEntity

    @OneToMany(() => PostEntity, post => post.user)
    posts: PostEntity[]

    @Column({ default: false })
    isDelete: boolean;
}