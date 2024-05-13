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

    async cancelSubscription(subscriptionId: string) {
        return this.stripe.subscriptions.cancel(subscriptionId)
    }

    private async createPayment(unit_amount: number, description: string, userId: string, termSubscriptionType: TermSubscriptionType, isSubscription: boolean = false) {

        const options: Stripe.Checkout.SessionCreateParams = {
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: unit_amount * 100,
                        product_data: {
                            name: 'Subscription',
                            description: description,
                        },
                    },
                    quantity: 1
                },
            ],
            success_url: 'https://example.com/success',
            mode: 'payment',
            metadata: {
                userId,
                termSubscriptionType
            },
        }

        if (isSubscription) {
            options.line_items[0].price_data.recurring = {
                interval: termSubscriptionType,
            }
            options.mode = 'subscription'
            options.subscription_data = {
                billing_cycle_anchor: Math.round(Date.now() / 1000) + 10,
            }
        }

        const session = await this.stripe.checkout.sessions.create(options);

        return session
    }

    async paymentSubscription(term: TermSubscriptionType, userId: string, isSubscription: boolean): Promise<Result<Stripe.Response<Stripe.Checkout.Session>>> {
        try {
            let session: Stripe.Response<Stripe.Checkout.Session>

            switch (term) {
                case TermSubscriptionType.ONE_DAY: {
                    session = await this.createPayment(10, 'subscription on 1 day', userId, term, isSubscription)
                    break
                }
                case TermSubscriptionType.SEVEN_DAYS: {
                    session = await this.createPayment(50, 'subscription on 7 days', userId, term, isSubscription)
                    break
                }
                case TermSubscriptionType.ONE_MONTH: {
                    session = await this.createPayment(100, 'subscription on 1 month', userId, term, isSubscription)
                    break
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