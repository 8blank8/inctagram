import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { config } from 'dotenv'
config()

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    public testMail(mailAddress: string, content: string = 'welcome'): void {
        this.mailerService
            .sendMail({
                to: mailAddress, // list of receivers
                from: process.env.MAILER_USER, // sender address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: content, // plaintext body
                html: `<b>${content}</b>`, // HTML body content
            })
            .then((res) => console.log(res.accepted, res.response))
            .catch(console.log);
    }

    public async sendEmailConfirmationMessage(email: string, query: string) {
        return this.mailerService
            .sendMail({
                to: email,
                from: process.env.MAILER_USER,
                subject: 'Confirmation code',
                html: `
          <div>
           <h5>Click the link below to complete registration</h5>
          </div>
          <p>
           <a href="${process.env.FRONT_URL}/confirm-registration?${query}">
            Click here to end registration
           </a>
         </p>`,
            })
            .then(({ accepted, response }) => {
                console.log('send Email Confirmation ==> ', query, accepted, response);
            });
    }

    public async sendEmailPassRecovery(email: string, query: string) {
        return this.mailerService
            .sendMail({
                to: email,
                from: process.env.MAILER_USER,
                subject: 'Password reset',
                html: `
          <div>
           <h5>Click the link below to complete registration</h5>
          </div>
          <p>
           <a href="${process.env.FRONT_URL}/password-reset?${query}">
            Click here to set new password
           </a>
         </p>`,
            })
            .then(({ accepted, response }) => {
                console.log('send Email PassRecovery ==> ', query, accepted, response);
            });
    }
    public send(): void {
        this.mailerService
            .sendMail({
                to: 'test@nestjs.com', // list of receivers
                from: process.env.MAILER_USER, // sender address
                subject: 'Testing Nest MailerModule ✔', // Subject line
                text: 'welcome', // plaintext body
                html: '<b>welcome</b>', // HTML body content
            })
            .then(() => { })
            .catch(() => { });
    }
}
