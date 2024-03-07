import { ConfigService } from '@nestjs/config';

import fs from 'fs';

import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

//import { Logtail } from '@logtail/node';
//import { LogtailTransport } from '@logtail/winston';

export const loadLoggerConfig = (logger: Logger, config: ConfigService) => {
  const { colorize, combine, label, printf, timestamp } = format;

  const customLoggerFormat = printf(
    ({
      label,
      level,
      message,
      timestamp,
    }: {
      label: string;
      level: string;
      message: string;
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
    datePattern: 'YYYY-MM-DD',
    dirname: '../logs/error',
    filename: `log-%DATE%.log`,
    level: 'error',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    zippedArchive: true,
  });

  const fileRotateTransportInfo = new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    dirname: '../logs/info',
    filename: `log-%DATE%.log`,
    level: 'info',
    maxFiles: process.env.LOG_MAX_DAYS || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    zippedArchive: true,
  });

  const fileRotateTransportCombined = new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    dirname: '../logs/combined',
    filename: `log-%DATE%.log`,
    maxFiles: process.env.LOG_MAX_DAYS || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    zippedArchive: true,
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
