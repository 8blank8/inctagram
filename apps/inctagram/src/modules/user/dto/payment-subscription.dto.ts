import { PaymentSystenType, TermSubscriptionType } from "@libs/enum/enum";
import { ApiProperty } from "@nestjs/swagger";

export class PaymentSubscriptionDto {
    @ApiProperty({ enum: PaymentSystenType })
    paymentSystem: PaymentSystenType

    @ApiProperty({ enum: TermSubscriptionType })
    term: TermSubscriptionType
}