import { Body, Controller, Get, Post } from "@nestjs/common";
import { StripeService } from "../services/stripe.service";


@Controller('stripe')
export class StripeContoller {
    constructor(
        private stripeService: StripeService
    ) { }

    @Post('webhook')
    async payment(
        @Body() dto: any
    ) {
        console.log(dto)
    }
}