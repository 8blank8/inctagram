import { SubscriptionEntity } from "@libs/infra/entities/subscription.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpiredSubscriptionHandler } from "./subscription.processor";

@Module({
    imports: [
        TypeOrmModule.forFeature([SubscriptionEntity])
    ],
    providers: [
        ExpiredSubscriptionHandler
    ],
    exports: [
        ExpiredSubscriptionHandler
    ]
})
export class SchedulerModule { }