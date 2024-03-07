import { registerAs } from '@nestjs/config';

import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';

import { FileConfig } from '@files/config/file-config.type';

import validateConfig from '../../utils/validate-config';

enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
}

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  ACCESS_KEY_ID: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  @IsOptional()
  AWS_DEFAULT_S3_URL: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  AWS_S3_REGION: string;

  @IsEnum(FileDriver)
  FILE_DRIVER: FileDriver;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  SECRET_ACCESS_KEY: string;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKeyId: process.env.ACCESS_KEY_ID,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
    awsS3Region: process.env.AWS_S3_REGION,
    driver: process.env.FILE_DRIVER ?? 'local',
    maxFileSize: 5242880, // 5mb
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  };
});
