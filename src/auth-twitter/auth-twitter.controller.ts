import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UAParser } from 'ua-parser-js';

import { RefreshToken } from '@refresh-token/domain/refresh-token';

import { AuthService } from '../auth/auth.service';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthTwitterService } from './auth-twitter.service';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/twitter',
  version: '1',
})
export class AuthTwitterController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTwitterService: AuthTwitterService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthTwitterLoginDto,
    @Res() res,
    @Req() req,
  ): Promise<LoginResponseType> {
    const socialData =
      await this.authTwitterService.getProfileByToken(loginDto);
    const ua = UAParser(req.headers['user-agent']);
    const refreshTokenPayload: Partial<RefreshToken> = {
      browser: ua.browser.name,
      ip: req.id,
      os: ua.os.name,
      userAgent: JSON.stringify(ua),
    };
    const cookiePayload = this.authService.validateSocialLogin(
      'apple',
      socialData,
      refreshTokenPayload,
    );
    res.setHeader('Set-Cookie', cookiePayload);
    return cookiePayload;
  }
}
