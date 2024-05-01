import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";


@Entity()
export class UserAvatarEntity extends BaseEntity {

    @Column()
    url: string

    @Column({ type: 'float' })
    offsetX: number

    @Column({ type: 'float' })
    offsetY: number

    @Column({ type: 'float' })
    scale: number

    @OneToOne(() => UserEntity, user => user.avatar)
    user: UserEntity
}