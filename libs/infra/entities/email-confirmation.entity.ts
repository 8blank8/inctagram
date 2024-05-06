import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";


@Entity()
export class EmailConfirmationEntity extends BaseEntity {
    @Column()
    confirmationCode: string

    @OneToOne(() => UserEntity, user => user.confirmation)
    user: UserEntity
}