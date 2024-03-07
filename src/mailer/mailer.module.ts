import { Module } from '@nestjs/common';

import { MailerService } from './mailer.service';

@Module({
  exports: [MailerService],
  providers: [MailerService],
})
export class MailerModule {}
