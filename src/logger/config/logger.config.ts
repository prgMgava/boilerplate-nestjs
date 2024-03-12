import { ConfigService } from '@nestjs/config';

import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const loadLoggerConfig = (config: ConfigService) => {
  const { combine, label, printf, timestamp } = format;

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

  const fileRotateTransportError = new DailyRotateFile({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: `./logs/error`,
    filename: `log-error-%DATE%.log`,
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    zippedArchive: true,
  });

  const fileRotateTransportInfo = new DailyRotateFile({
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: `./logs/info`,
    filename: `log-info-%DATE%.log`,
    maxFiles: process.env.LOG_MAX_DAYS || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    zippedArchive: true,
  });

  const fileRotateTransportCombined = new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    dirname: './logs/combined',
    filename: `log-%DATE%.log`,
    maxFiles: process.env.LOG_MAX_DAYS || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    zippedArchive: true,
  });

  const logTail = logTailTransport(fileRotateTransportCombined);

  return createLogger({
    format: combine(
      label({ label: config.get('app.name') }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      customLoggerFormat,
    ),
    transports: [
      new transports.Console({}),
      fileRotateTransportError,
      fileRotateTransportInfo,
      new LogtailTransport(logTail, { level: 'error' }),
    ],
  });
};

const logTailTransport = (
  fileRotateTransportCombined: DailyRotateFile,
): Logtail => {
  // Checkout the docs #logs.md for more information
  const logTail = new Logtail(process.env.LOG_TAIL_TOKEN as string);

  fileRotateTransportCombined.on('new', async () => {
    await logTail.flush();
  });

  return logTail;
};
