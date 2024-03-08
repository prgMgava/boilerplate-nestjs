import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request as RequestType } from 'express';
import { Strategy } from 'passport-jwt';
import { AllConfigType } from 'src/config/config.type';

import { OrNeverType } from '../../utils/types/or-never.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: JwtRefreshStrategy.extractJwt,
      secretOrKey: configService.get('auth.refreshSecret', { infer: true }),
    });
  }

  private static extractJwt(req: RequestType): string | null {
    if (req.cookies) {
      const cookieName = process.env.COOKIE_NAME || 'api-cookie';
      if (req.cookies[cookieName].refreshToken) {
        if (!!req.cookies[cookieName].refreshToken) {
          return req.cookies[cookieName].refreshToken;
        }
      }
      return req.cookies[cookieName].refreshToken;
    }

    return null;
  }

  public validate(
    payload: JwtRefreshPayloadType,
  ): OrNeverType<JwtRefreshPayloadType> {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
