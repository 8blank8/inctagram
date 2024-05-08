import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { PaymentSubscriptionCommand } from "./dto/payment-subscription.command";
import { Result } from "@libs/core/result";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { StripeService } from "@inctagram/src/modules/stripe/services/stripe.service";
import { PaymentSystenType } from "@libs/enum/enum";
import { UserRepository } from "@inctagram/src/modules/user/repository/user.repository";


@Injectable()
export class PaymentSubscriptionUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
        private stripeService: StripeService,
    ) { }

    async execute(command: PaymentSubscriptionCommand): Promise<Result<{ url: string }>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    private async doOperation(
        { paymentSystem, term, userId }: PaymentSubscriptionCommand,
        manager: EntityManager
    ): Promise<Result<{ url: string }>> {
        try {

            const user = await this.userRepo.getUserById(userId)
            if (!user) return Result.Err('user not found')

            let paymentUrl: string

            switch (paymentSystem) {
                case PaymentSystenType.STRIPE: {
                    const res = await this.stripeService.paymentSubscription(term, user.id)
                    if (!res.isSuccess) return Result.Err(res.err.message)

                    paymentUrl = res.value.url
                }
            }

            return Result.Ok({ url: paymentUrl })
        } catch (e) {
            console.log(e)
            return Result.Err(PaymentSubscriptionUseCase.name + ' some error')
        }
    }
}