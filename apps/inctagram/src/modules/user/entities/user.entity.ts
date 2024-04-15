import { BaseEntity } from "../../../../../../libs/infra/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { DeviceEntity } from "../../device/entities/device.entity";


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

    @Column({ default: false })
    isDelete: boolean;
}