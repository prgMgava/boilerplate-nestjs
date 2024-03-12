import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionTitleList } from 'src/common/constants/exception-title-list.constants';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';

export class NotFoundException extends HttpException {
  constructor(message?: string, code?: number) {
    super(
      {
        code: code || StatusCodesList.NotFound,
        error: true,
        message: message || ExceptionTitleList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
