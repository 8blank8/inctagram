import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { Body, Controller, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UpdateUserCommand } from "../use-cases/update/dto/update-user.command";
import { ReqWithUser } from "@libs/types/req-with-user";
import { UpdateUserUseCase } from "../use-cases/update/update-user.use-case";
import { UpdateUserDto } from "../dto/update-user.dto";
import { PaymentSubscriptionDto } from "../dto/payment-subscription.dto";
import { PaymentSubscriptionCommand } from "../use-cases/pyament/dto/payment-subscription.command";
import { PaymentSubscriptionUseCase } from "../use-cases/pyament/payment-subscription.use-case";
import { Response } from "express";


@ApiTags('users')
@Controller('users')
export class UserContoller {

    constructor(
        private updateUserUseCase: UpdateUserUseCase,
        private paymentSubscriptionUseCase: PaymentSubscriptionUseCase
    ) { }

    @UseGuards(JwtAuthGuard())
    @Put('/profile')
    async updateUserProfile(
        @Body() dto: UpdateUserDto,
        @Req() req: ReqWithUser
    ) {
        const command: UpdateUserCommand = {
            ...dto,
            userId: req.userId
        }
        return this.updateUserUseCase.execute(command)
    }

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
}