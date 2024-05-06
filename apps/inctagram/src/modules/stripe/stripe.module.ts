import { Module } from "@nestjs/common";
import { StripeService } from "./services/stripe.service";
import { StripeContoller } from "./contoller/stripe.contoller";



@Module({
    controllers: [
        StripeContoller
    ],
    providers: [
        StripeService
    ],
    exports: [
        StripeService
    ]
})
export class StripeModule { }