import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

import { AllConfigType } from '@config/config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      auth: {
        pass: configService.get('mail.password', { infer: true }),
        user: configService.get('mail.user', { infer: true }),
      },
      host: configService.get('mail.host', { infer: true }),
      ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      port: configService.get('mail.port', { infer: true }),
      requireTLS: configService.get('mail.requireTLS', { infer: true }),
      secure: configService.get('mail.secure', { infer: true }),
    });
  }

  async sendMail({
    context,
    templatePath,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    context: Record<string, unknown>;
    templatePath: string;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
