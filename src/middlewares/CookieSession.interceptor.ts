import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { Response } from 'express';
import { map, Observable } from 'rxjs';

export class CookieSessionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse() as Response;
        const cookieName = process.env.COOKIE_NAME || 'api-cookie';
        response.cookie(cookieName, data, {
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: true,
        });
        return data;
      }),
    );
  }
}
