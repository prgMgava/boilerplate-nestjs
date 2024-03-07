import { registerAs } from '@nestjs/config';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import validateConfig from '.././utils/validate-config';
import { AppConfig } from './app-config.type';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_LOG_FILE_NAME: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiPrefix: process.env.API_PREFIX || 'api',
    appLogFileName: process.env.APP_LOG_FILE_NAME || '@logs',
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    frontendDomain: process.env.FRONTEND_DOMAIN,
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    name: process.env.APP_NAME || 'app',
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    workingDirectory: process.env.PWD || process.cwd(),
  };
});
