import { Module } from '@nestjs/common';
import { MailService } from '@app/common/mailer/mail.service';

// TODO: think about how to move here MailerModule
@Module({
  imports: [],
  providers: [MailService],
})
export class MailModule {}
