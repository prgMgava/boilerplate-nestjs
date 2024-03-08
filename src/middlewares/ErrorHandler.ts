import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

import LoggerService from '@logger/logger.service';

@Catch()
export class ErrorHandler implements ExceptionFilter {
  private readonly logger: LoggerService;

  constructor(private readonly _loggerService: LoggerService) {
    this.logger = this._loggerService;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number, message: any;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    this.logger.error({ message, statusCode });

    response.status(statusCode).json({
      message,
      statusCode,
    });
  }
}
