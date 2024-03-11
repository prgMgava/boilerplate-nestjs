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
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthFacebookService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @UseInterceptors(new CookieSessionInterceptor())
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthFacebookLoginDto,
    @Req() req,
    @Res() res,
  ): Promise<LoginResponseType> {
    const socialData =
      await this.authFacebookService.getProfileByToken(loginDto);
    const ua = UAParser(req.headers['user-agent']);
    const refreshTokenPayload: Partial<RefreshToken> = {
      browser: ua.browser.name,
      ip: req.id,
      os: ua.os.name,
      userAgent: JSON.stringify(ua),
    };
    const cookiePayload = this.authService.validateSocialLogin(
      'facebook',
      socialData,
      refreshTokenPayload,
    );
    res.setHeader('Set-Cookie', cookiePayload);
    return cookiePayload;
  }
}
