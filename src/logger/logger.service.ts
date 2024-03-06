import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger, createLogger, format, transports } from 'winston';
import { Pool } from 'pg';

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
    const { combine, timestamp, label, printf } = format;
    const customLoggerFormat = printf(
      ({
        level,
        message,
        label,
        timestamp,
      }: {
        level: string;
        message: string;
        label: string;
        timestamp: string;
      }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      },
    );

    this.logger = createLogger({
      format: combine(
        label({ label: config.get('app.name') }),
        timestamp(),
        customLoggerFormat,
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: config.get('app.logFileName') }),
      ],
    });
  }

  log(message: any) {
    this.logger.log(WinstonLogLevel.INFO, message);
  }
  async error(message: any) {
    this.logger.log(WinstonLogLevel.ERROR, message);
    await this.logToDatabase(WinstonLogLevel.ERROR, message);
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

  private async logToDatabase(level: string, error: any) {
    //TODO: use winston pg https://github.com/InnovA2/winston-pg
    this.pool = new Pool({
      user: process.env.LOG_DATABASE_USERNAME,
      host: process.env.LOG_DATABASE_HOST,
      database: process.env.LOG_DATABASE_NAME,
      password: process.env.LOG_DATABASE_PASSWORD,
      port: (process.env.LOG_DATABASE_PORT as any) || 5432,
    });

    this.pool
      .query(
        'INSERT INTO log (level, message, statusCode, userId, http_params, http_query, http_endpoint, http_method, http_body) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          level,
          error.message,
          error.statusCode,
          error.userId,
          error.params,
          error.query,
          error.endpoint,
          error.method,
          error.body,
        ],
      )
      .then(() => {
        this.logger.info('Log inserido no banco de dados.');
      })
      .catch((error) => {
        this.logger.info('Erro ao inserir log no banco de dados:', error);
      });

    await this.pool.end();
  }
}
