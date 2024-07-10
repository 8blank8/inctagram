import { BaseEntity } from "./base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { UserAvatarEntity } from "./user-avatar.entity";
import { PostEntity } from "./post.entity";
import { EmailConfirmationEntity } from "./email-confirmation.entity";
import { SubscriptionEntity } from "./subscription.entity";
import { AccountType } from "../../../libs/enum/enum";


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

    @Column({ nullable: true })
    country: string

    @Column({ nullable: true })
    city: string

    @Column({ type: 'timestamp without time zone', nullable: true, default: null })
    dateOfBirth: Date | null

    @Column({ default: false })
    emailConfirmed: boolean

    @Column({ type: 'enum', enum: AccountType, default: AccountType.PERSONAL })
    accountType: AccountType

    @Column({ nullable: true })
    passwordRecoveryCode: string | null

    @Column({ nullable: true })
    passwordSalt: string | null

    @Column({ nullable: true })
    passwordHash: string | null

    @Column({ default: true })
    public: boolean

    @OneToMany(() => DeviceEntity, device => device.user)
    devices: DeviceEntity[]

    @OneToOne(() => UserAvatarEntity, avatar => avatar.user, { nullable: true })
    @JoinColumn()
    avatar: UserAvatarEntity

    @OneToMany(() => PostEntity, post => post.user)
    posts: PostEntity[]

    @OneToOne(() => EmailConfirmationEntity, confirmation => confirmation.user, { nullable: true })
    @JoinColumn()
    confirmation: EmailConfirmationEntity | null

    @OneToOne(() => SubscriptionEntity, subscription => subscription.user, { nullable: true })
    @JoinColumn()
    subscription: SubscriptionEntity | null

    @Column({ default: false })
    isDelete: boolean;
}