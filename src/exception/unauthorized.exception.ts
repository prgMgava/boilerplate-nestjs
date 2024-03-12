import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionTitleList } from 'src/common/constants/exception-title-list.constants';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';

export class UnauthorizedException extends HttpException {
  constructor(message?: string, code?: number) {
    super(
      {
        code: code || StatusCodesList.UnauthorizedAccess,
        error: true,
        message: message || ExceptionTitleList.Unauthorized,
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
