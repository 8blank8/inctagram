import { BaseEntity } from "../../../../../../libs/infra/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";


@Entity()
export class DeviceEntity extends BaseEntity {

    @Column()
    title: string

    @ManyToOne(() => UserEntity, user => user.devices)
    user: UserEntity
}