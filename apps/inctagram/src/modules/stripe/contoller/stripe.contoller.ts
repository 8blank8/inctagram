import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import Stripe from 'stripe'
import { PaymentSystenType } from "@libs/enum/enum";
import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { PaymentSubscriptionDto } from "../dto/payment-subscription.dto";
import { ReqWithUser } from "@libs/types/req-with-user";
import { Response } from 'express'
import { SuccessPaymentSubscriptionUseCase } from "../use-cases/success-payment/success-payment-subscription.use-case";
import { PaymentSubscriptionUseCase } from "../use-cases/create/payment-subscription.use-case";
import { PaymentSubscriptionCommand } from "../use-cases/create/dto/payment-subscription.command";

@Controller('stripe')
export class StripeContoller {
    constructor(
        private successPaymentSubscriptionUseCase: SuccessPaymentSubscriptionUseCase,
        private paymentSubscriptionUseCase: PaymentSubscriptionUseCase
    ) { }

    @UseGuards(JwtAuthGuard())
    @Post('/payment-subscription')
    async paymentSubscription(
        @Req() req: ReqWithUser,
        @Body() dto: PaymentSubscriptionDto,
        @Res() res: Response
    ) {
        const command: PaymentSubscriptionCommand = {
            ...dto,
            userId: req.userId
        }

        const result = await this.paymentSubscriptionUseCase.execute(command)

        if (!result.isSuccess) return res.status(HttpStatus.BAD_REQUEST).send({
            resultCode: 1,
            data: {},
            errors: [result.err]
        })

        return res.redirect(result.value.url)
    }

    @Post('webhook')
    async payment(
        @Body() dto: Stripe.Event,
        @Res() res: Response
    ) {
        if (dto.type === 'checkout.session.completed') {
            const result = await this.successPaymentSubscriptionUseCase.execute({ dto, paymentSystem: PaymentSystenType.STRIPE })
            if (!result.isSuccess) return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)

            return res.sendStatus(HttpStatus.CREATED)
        }
        return
    }
}