import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Logger } from 'winston';

import { loadLoggerConfig } from './config/logger.config';

enum WinstonLogLevel {
  DEBUG = 'debug',
  ERROR = 'error',
  HTTP = 'HTTP',
  INFO = 'info',
  SILLY = 'silly',
  VERBOSE = 'verbose',
  WARN = 'WARN',
}

@Injectable()
export default class LoggerService implements NestLoggerService {
  private pool: Pool;
  public logger: Logger;

  constructor(config: ConfigService) {
    loadLoggerConfig(this.logger, config);
  }

  debug?(message: any) {
    this.logger.log(WinstonLogLevel.DEBUG, message);
  }
  error(message: any) {
    this.logger.log(WinstonLogLevel.ERROR, message);
  }
  log(message: any) {
    this.logger.log(WinstonLogLevel.INFO, message);
  }
  verbose?(message: any) {
    this.logger.log(WinstonLogLevel.VERBOSE, message);
  }
  warn(message: any) {
    this.logger.log(WinstonLogLevel.WARN, message);
  }
}
