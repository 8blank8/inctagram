import { PaymentSystenType } from '@libs/enum/enum'
import Stripe from 'stripe'

export class SuccessPaymentSubscriptionCommand {
    dto: Stripe.Event
    paymentSystem: PaymentSystenType
}