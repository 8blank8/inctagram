import { config } from 'dotenv'
config()
import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: String(process.env.MAILER_HOST),
                port: +process.env.MAILER_PORT,
                secure: true,
                auth: {
                    user: String(process.env.MAILER_USER),
                    pass: String(process.env.MAILER_PASS),
                },
            },
        } as MailerOptions),
    ]
})
export class MailModule { }