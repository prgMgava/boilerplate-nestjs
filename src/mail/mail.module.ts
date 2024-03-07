import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailerModule } from '../mailer/mailer.module';
import { MailService } from './mail.service';

@Module({
  exports: [MailService],
  imports: [ConfigModule, MailerModule],
  providers: [MailService],
})
export class MailModule {}
