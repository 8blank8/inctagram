import { Module } from "@nestjs/common";
import { StripeService } from "./services/stripe.service";
import { StripeContoller } from "./contoller/stripe.contoller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "@libs/infra/entities/subscription.entity";
import { UserModule } from "../user/user.module";
import { JwtService } from "@nestjs/jwt";
import { PaymentSubscriptionUseCase } from "./use-cases/create/payment-subscription.use-case";
import { SuccessPaymentSubscriptionUseCase } from "./use-cases/success-payment/success-payment-subscription.use-case";



@Module({
    imports: [
        TypeOrmModule.forFeature([SubscriptionEntity]),
        UserModule
    ],
    controllers: [
        StripeContoller
    ],
    providers: [
        StripeService,
        PaymentSubscriptionUseCase,
        SuccessPaymentSubscriptionUseCase,
        JwtService
    ],
    exports: [
        StripeService
    ]
})
export class StripeModule { }