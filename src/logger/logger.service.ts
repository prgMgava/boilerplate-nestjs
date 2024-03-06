import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { Pool } from 'pg';
import { loadLoggerConfig } from './config/logger.config';

enum WinstonLogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'WARN',
  HTTP = 'HTTP',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

@Injectable()
export default class LoggerService implements NestLoggerService {
  public logger: Logger;
  private pool: Pool;

  constructor(config: ConfigService) {
    loadLoggerConfig(this.logger, config);
  }

  log(message: any) {
    this.logger.log(WinstonLogLevel.INFO, message);
  }
  error(message: any) {
    this.logger.log(WinstonLogLevel.ERROR, message);
  }
  warn(message: any) {
    this.logger.log(WinstonLogLevel.WARN, message);
  }
  debug?(message: any) {
    this.logger.log(WinstonLogLevel.DEBUG, message);
  }
  verbose?(message: any) {
    this.logger.log(WinstonLogLevel.VERBOSE, message);
  }
}
