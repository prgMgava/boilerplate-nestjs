import { registerAs } from '@nestjs/config';

import { IsBoolean, IsString } from 'class-validator';

import { AuthConfig } from '@auth/config/auth-config.type';

import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsBoolean()
  AUTH_IS_SAME_SITE: boolean;

  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_COOKIE_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    cookieExpires: process.env.AUTH_JWT_COOKIE_EXPIRES_IN,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    isSameSite: process.env.IS_SAME_SITE === 'true',
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    secret: process.env.AUTH_JWT_SECRET,
  };
});
