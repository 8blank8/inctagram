import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../../user/repository/user.repository";
import { ResendConfirmationCodeCommand } from "./dto/resend-confirmation-code.command";
import { Result } from "../../../../../../../libs/core/result";
import { MailService } from "../../../../../../../libs/mailer/mailer.service";


@Injectable()
export class ResendConfirmationCodeUseCase {
    constructor(
        private userRepo: UserRepository,
        private mailService: MailService
    ) { }

    async execute(command: ResendConfirmationCodeCommand): Promise<Result> {
        const user = await this.userRepo.getUserByEmail(command.email)
        if (!user) return Result.Err('user with email not found')
        if (user.emailConfirmed) return Result.Err('user email is confirmed')

        await this.mailService.sendEmailConfirmationMessage(user.email, user.confirmationCode)

        return Result.Ok()
    }
}