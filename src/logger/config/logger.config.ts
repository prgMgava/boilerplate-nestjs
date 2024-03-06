import { Logger, createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';
//import { Logtail } from '@logtail/node';
//import { LogtailTransport } from '@logtail/winston';

export const loadLoggerConfig = (logger: Logger, config: ConfigService) => {
  const { combine, timestamp, label, printf, colorize } = format;

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

  const dir = '../logs';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.mkdirSync(`${dir}/error`);
    fs.mkdirSync(`${dir}/info`);
    fs.mkdirSync(`${dir}/combined`);
  }

  const fileRotateTransportError = new DailyRotateFile({
    level: 'error',
    filename: `log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    dirname: '../logs/error',
  });

  const fileRotateTransportInfo = new DailyRotateFile({
    level: 'info',
    filename: `log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    dirname: '../logs/info',
    maxFiles: process.env.LOG_MAX_DAYS || '14d',
  });

  const fileRotateTransportCombined = new DailyRotateFile({
    filename: `log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    dirname: '../logs/combined',
    maxFiles: process.env.LOG_MAX_DAYS || '14d',
  });

  //const logTail = logTailTransport(fileRotateTransportCombined);

  logger = createLogger({
    format: combine(
      colorize({ all: true }),
      label({ label: config.get('app.name') }),
      timestamp(),
      customLoggerFormat,
    ),
    transports: [
      new transports.Console(),
      fileRotateTransportCombined,
      fileRotateTransportError,
      fileRotateTransportInfo,
      //new LogtailTransport(logTail, {level: 'error'}),
    ],
  });
};

// const logTailTransport = (
//   fileRotateTransportCombined: DailyRotateFile,
// ): Logtail => {
//   // Checkout the docs #logs.md for more information
//   const logTail = new Logtail(process.env.LOG_TAIL_TOKEN as string);

//   fileRotateTransportCombined.on('new', async () => {
//     await logTail.flush();
//   });

//   return logTail;
// };

const postgresTransport = () => {
  const logger = new Logger({
    transports: [
      new Postgres({
        connectionString: 'your connection string',
        maxPool: 10,
        level: 'info',
        tableName: 'winston_logs',
      }),
    ],
  });
};
