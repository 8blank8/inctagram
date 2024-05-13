import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PaymentSystenType, TermSubscriptionType } from "../../enum/enum";
import { UserEntity } from "./user.entity";


@Entity()
export class SubscriptionEntity extends BaseEntity {
    @Column()
    price: number

    @Column({ enum: TermSubscriptionType, type: 'enum' })
    subscriptionType: TermSubscriptionType

    @Column({ enum: PaymentSystenType, type: 'enum' })
    paymentSystem: PaymentSystenType

    @Column({ default: false })
    isSubscription: boolean

    @Column({ nullable: true })
    subscriptionId: string

    @Column({ default: true })
    isActive: boolean

    @Column({ type: 'timestamp without time zone' })
    expirationDate: Date

    @OneToOne(() => UserEntity, user => user.subscription)
    user: UserEntity
}