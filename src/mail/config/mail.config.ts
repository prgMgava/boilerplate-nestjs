import { registerAs } from '@nestjs/config';

import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { MailConfig } from '@mail/config/mail-config.type';

import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @IsString()
  MAIL_HOST: string;

  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;

  @IsBoolean()
  MAIL_SECURE: boolean;

  @IsString()
  @IsOptional()
  MAIL_USER: string;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    host: process.env.MAIL_HOST,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    password: process.env.MAIL_PASSWORD,
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
  };
});
