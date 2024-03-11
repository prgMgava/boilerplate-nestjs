import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionTitleList } from 'src/common/constants/exception-title-list.constants';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';

export class ForbiddenException extends HttpException {
  constructor(message?: string, code?: number) {
    super(
      {
        code: code || StatusCodesList.Forbidden,
        error: true,
        message: message || ExceptionTitleList.Forbidden,
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
