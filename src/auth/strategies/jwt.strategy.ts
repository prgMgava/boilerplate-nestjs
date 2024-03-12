import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request as RequestType } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AllConfigType } from '@config/config.type';
import { OrNeverType } from '@utils/types/or-never.type';

import { JwtPayloadType } from './types/jwt-payload.type';
const cookieExtractor = (req) => {
  return req?.cookies?.Authentication;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  private static extractJwt(req: RequestType): string | null {
    const cookieName = process.env.COOKIE_NAME || 'api-cookie';
    if (
      req.cookies &&
      cookieName in req.cookies &&
      req.cookies[cookieName].token
    ) {
      return req.cookies[cookieName].token;
    }

    return null;
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
