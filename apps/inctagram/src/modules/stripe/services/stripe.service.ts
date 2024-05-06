import { Result } from "@libs/core/result";
import { TermSubscriptionType } from "@libs/enum/enum";
import { Injectable } from "@nestjs/common";
import { config } from 'dotenv'
config()
import Stripe from 'stripe'


@Injectable()
export class StripeService {

    private stripe: Stripe

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }

    private async createPayment(unit_amount: number, description: string) {
        const session = await this.stripe.checkout.sessions.create({
            success_url: 'https://example.com/success',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: unit_amount * 100,
                        product_data: {
                            name: 'Subscription',
                            description: description
                        }
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            currency: 'usd',

        });

        return session
    }

    async paymentSubscription(term: TermSubscriptionType): Promise<Result<Stripe.Response<Stripe.Checkout.Session>>> {
        try {
            let session: Stripe.Response<Stripe.Checkout.Session>

            switch (term) {
                case TermSubscriptionType.ONE_DAY: {
                    session = await this.createPayment(10, 'subscription on 1 day')
                }
                case TermSubscriptionType.SEVEN_DAYS: {
                    session = await this.createPayment(50, 'subscription on 7 days')
                }
                case TermSubscriptionType.ONE_MONTH: {
                    session = await this.createPayment(100, 'subscription on 1 month')
                }
            }

            if (!session) return Result.Err('payment session not created')

            return Result.Ok(session)
        } catch (e) {
            console.log('paymentSubscription ' + e)
            return Result.Err('payment subscription some error')
        }
    }
}