import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailService } from '@app/common/mailer/mail.service';
import { settings_env } from '@app/common/settings_env';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: settings_env.MAIL_TRANSPORT,
      transport: {
        host: settings_env.EMAIL_HOST || 'smtp.office365.com',
        port: Number(settings_env.EMAIL_PORT),
        secure: true, // true for 465, false for other ports
        auth: {
          user: settings_env.EMAIL_ID, // generated ethereal user
          pass: settings_env.EMAIL_PASS, // generated ethereal password
        },
      },
      defaults: {
        from: settings_env.EMAIL_ID || settings_env.MAIL_FROM_DEFAULT,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
