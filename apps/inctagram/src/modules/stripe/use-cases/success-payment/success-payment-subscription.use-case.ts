import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { SuccessPaymentSubscriptionCommand } from "./dto/success-payment-subscription.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { SubscriptionEntity } from "@libs/infra/entities/subscription.entity";
import { AccountType, TermSubscriptionType } from "@libs/enum/enum";
import { UserRepository } from "@inctagram/src/modules/user/repository/user.repository";
import { StripeService } from "../../services/stripe.service";


@Injectable()
export class SuccessPaymentSubscriptionUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
    ) { }

    async execute(command: SuccessPaymentSubscriptionCommand): Promise<Result<void>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { dto, paymentSystem }: SuccessPaymentSubscriptionCommand,
        manager: EntityManager
    ): Promise<Result<void>> {
        try {
            if (dto.type !== 'checkout.session.completed') return Result.Err('event type not found')

            const user = await this.userRepo.getUserById(dto.data.object.metadata.userId)
            if (!user) return Result.Err('user not found')

            user.accountType = AccountType.BUSINESS

            await manager.save(user)

            const subscription = new SubscriptionEntity()
            subscription.createdAt = new Date()
            subscription.paymentSystem = paymentSystem
            subscription.user = user
            subscription.isActive = true

            if (dto.data.object.subscription) {
                subscription.subscriptionId = dto.data.object.subscription as string
                subscription.isSubscription = true
            }

            switch (dto.data.object.metadata.termSubscriptionType) {
                case TermSubscriptionType.ONE_DAY: {
                    console.log(1)
                    subscription.price = 10
                    subscription.subscriptionType = TermSubscriptionType.ONE_DAY
                    await this.updateSubscriptionExpired(subscription, 1)
                    break
                }
                case TermSubscriptionType.SEVEN_DAYS: {
                    console.log(2)
                    subscription.price = 50
                    subscription.subscriptionType = TermSubscriptionType.SEVEN_DAYS
                    await this.updateSubscriptionExpired(subscription, 7)
                    break
                }
                case TermSubscriptionType.ONE_MONTH: {
                    console.log(3)
                    subscription.price = 100
                    subscription.subscriptionType = TermSubscriptionType.ONE_MONTH
                    await this.updateSubscriptionExpired(subscription, 30)
                    break
                }
                default: {
                    return Result.Err('subscription type not supported')
                }
            }

            await manager.save(subscription)

            return Result.Ok()

        } catch (e) {
            console.log(SuccessPaymentSubscriptionUseCase.name, e)
            return Result.Err('payment subscription some error')
        }
    }

    private async updateSubscriptionExpired(subscription: SubscriptionEntity, dayCount: number) {
        const findedSubscription = await this.userRepo.getCurrentUserSubscription(subscription.user.id)
        console.log('findedSubscription', findedSubscription)
        if (!findedSubscription.length) {
            subscription.expirationDate = new Date(new Date().getTime() + dayCount * 24 * 60 * 60 * 1000)
            return
        }

        const expirationDate = new Date(findedSubscription[0].expirationDate.getTime() + dayCount * 24 * 60 * 60 * 1000)
        subscription.expirationDate = expirationDate
        console.log('subscription after added expiration date', subscription)
    }
}