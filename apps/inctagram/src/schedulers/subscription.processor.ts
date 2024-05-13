import { Result } from "@libs/core/result";
import { AccountType } from "@libs/enum/enum";
import { SubscriptionEntity } from "@libs/infra/entities/subscription.entity";
import { UserEntity } from "@libs/infra/entities/user.entity";
import { TransactionDecorator } from "@libs/infra/inside-transaction/inside-transaction";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, LessThan, MoreThan, Repository } from "typeorm";


@Injectable()
export class ExpiredSubscriptionHandler {
    constructor(
        @InjectRepository(SubscriptionEntity) private subscriptionRepo: Repository<SubscriptionEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private dataSource: DataSource
    ) { }

    @Cron(CronExpression.EVERY_SECOND)
    async execute() {
        const transaction = new TransactionDecorator(this.dataSource)
        await transaction.doOperation(
            null,
            this.getAndUpdateExpiredSubscriptions.bind(this)
        )
    }

    private async getAndUpdateExpiredSubscriptions(_, manager: EntityManager) {
        try {
            const subscriptions = await this.subscriptionRepo.find({
                where: {
                    isActive: true,
                    expirationDate: LessThan(new Date())
                },
                relations: {
                    user: true
                }
            })

            for (let subscription of subscriptions) {
                subscription.isActive = false

                const activeSubscription = await this.subscriptionRepo.find({
                    where: {
                        user: {
                            id: subscription.user.id
                        },
                        expirationDate: MoreThan(new Date()),
                        isActive: true
                    }
                })[0]

                if (!activeSubscription) {
                    subscription.user.accountType = AccountType.PERSONAL
                }
            }

            await manager.save(subscriptions)

            return Result.Ok()
        } catch (e) {
            console.log(ExpiredSubscriptionHandler.name, e)
            return Result.Err(ExpiredSubscriptionHandler.name + ' some error')
        }
    }
}