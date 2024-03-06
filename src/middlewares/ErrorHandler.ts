import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import LoggerService from 'src/logger/logger.service';

@Catch()
export class ErrorHandler implements ExceptionFilter {
  private readonly LoggerService: LoggerService;
  private readonly jwtService: JwtService;

  constructor(private readonly _loggerService: LoggerService) {
    this.LoggerService = this._loggerService;
    this.jwtService = new JwtService();
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const endpoint: string = request.route?.path;
    const params: { [key: string]: string } = request.params;
    const query: { [key: string]: string } = request.query;
    const body: { [key: string]: string } = request.body;

    const method: string = request.method;
    let decoded: any = null;

    const cookies = request.cookies;
    if (
      cookies &&
      cookies['orange_api_session_token'] &&
      cookies['orange_api_session_token'].token
    ) {
      decoded = this.jwtService.decode(
        cookies['orange_api_session_token'].token,
      );
    }
    let statusCode: number, message: any;
    if (exception.response && exception.response.errors) {
      statusCode = exception.response.status;
      message = exception.response.errors;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    await this.LoggerService.error({
      statusCode,
      message: JSON.stringify(message),
      userId: decoded?.id || null,
      params: params,
      endpoint: endpoint,
      query: query,
      method: method,
      body: body,
    });

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
