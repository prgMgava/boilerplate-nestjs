import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UAParser } from 'ua-parser-js';

import { CookieSessionInterceptor } from '@middlewares/CookieSession.interceptor';

import { RefreshToken } from '@refresh-token/domain/refresh-token';

import { AuthService } from '../auth/auth.service';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @UseInterceptors(new CookieSessionInterceptor())
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
    @Res() res,
    @Req() req,
  ): Promise<LoginResponseType> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);
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
