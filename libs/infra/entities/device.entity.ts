import { BaseEntity } from "./base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity()
export class DeviceEntity extends BaseEntity {

    @Column({ default: '' })
    ip: string

    @Column()
    title: string

    @ManyToOne(() => UserEntity, user => user.devices)
    user: UserEntity
}