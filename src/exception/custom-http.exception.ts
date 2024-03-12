import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionTitleList } from 'src/common/constants/exception-title-list.constants';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';

export class CustomHttpException extends HttpException {
  constructor(message?: string, statusCode?: number, code?: number) {
    super(
      {
        code: code || StatusCodesList.BadRequest,
        error: true,
        message: message || ExceptionTitleList.BadRequest,
        statusCode: statusCode || HttpStatus.BAD_REQUEST,
      },
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}
