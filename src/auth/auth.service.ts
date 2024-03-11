import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcryptjs';
import ms from 'ms';

import { ExceptionTitleList } from '@common/constants/exception-title-list.constants';
import { StatusCodesList } from '@common/constants/status-codes-list.constants';
import { AllConfigType } from '@config/config.type';
import { CustomHttpException } from '@exception/custom-http.exception';

import { MailService } from '@mail/mail.service';

import { RefreshToken } from '@refresh-token/domain/refresh-token';
import { RefreshTokenService } from '@refresh-token/refresh-token.service';
import { RoleEnum } from '@roles/roles.enum';
import { Session } from '@session/domain/session';
import { SessionService } from '@session/session.service';
import { SocialInterface } from '@social/interfaces/social.interface';
import { StatusEnum } from '@statuses/statuses.enum';
import { User } from '@users/domain/user';
import { UsersService } from '@users/users.service';

import { NullableType } from '../utils/types/nullable.type';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { LoginResponseType } from './types/login-response.type';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
    private refreshTokenService: RefreshTokenService,
  ) {}

  private async getTokensData(data: {
    sessionId: Session['id'];
    user: User;
    refreshTokenPayload: Partial<RefreshToken>;
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.user.id,
          role: data.user.role,
          sessionId: data.sessionId,
        },
        {
          expiresIn: tokenExpiresIn,
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        },
      ),
      await this.refreshTokenService.generateRefreshToken(
        data.user,
        data.refreshTokenPayload,
      ),
    ]);

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  /**
   * build response payload
   * @param accessToken
   * @param refreshToken
   */
  buildResponsePayload(accessToken: string, refreshToken?: string): string[] {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const cookieExpiresIn = this.configService.getOrThrow(
      'auth.cookieExpires',
      {
        infer: true,
      },
    );
    const isSameSite = this.configService.getOrThrow('auth.isSameSite', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    let tokenCookies = [
      `Authentication=${accessToken}; HttpOnly; Path=/; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      } Max-Age=${cookieExpiresIn}`,
    ];
    if (refreshToken) {
      tokenCookies = tokenCookies.concat([
        `Refresh=${refreshToken}; HttpOnly; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=${cookieExpiresIn}`,
        `ExpiresIn=${tokenExpires}; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=${cookieExpiresIn}`,
      ]);
    }
    return tokenCookies;
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new HttpException(
        {
          errors: {
            hash: `invalidHash`,
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.usersService.findOne({
      id: userId,
    });

    if (!user || user?.status?.id !== StatusEnum.inactive) {
      throw new HttpException(
        {
          error: `notFound`,
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.status = {
      id: StatusEnum.active,
    };

    await this.usersService.update(user.id, user);
  }

  /**
   * Create access token from refresh token
   * @param refreshToken
   */
  async createAccessTokenFromRefreshToken(refreshToken: string) {
    const { token } =
      await this.refreshTokenService.createAccessTokenFromRefreshToken(
        refreshToken,
      );
    return this.buildResponsePayload(token);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          errors: {
            email: 'emailNotExists',
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        expiresIn: this.configService.getOrThrow('auth.forgotExpires', {
          infer: true,
        }),
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      },
    );

    await this.mailService.forgotPassword({
      data: {
        hash,
      },
      to: email,
    });
  }

  /**
   * Get cookie for logout action
   */
  getCookieForLogOut(): string[] {
    const isSameSite = this.configService.getOrThrow('auth.isSameSite', {
      infer: true,
    });
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      }`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      }`,
      `ExpiresIn=; Path=/; Max-Age=0; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      }`,
    ];
  }
  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findOne({
      id: userJwtPayload.id,
    });
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
    });

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      },
    );

    await this.mailService.userSignUp({
      data: {
        hash,
      },
      to: dto.email,
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new HttpException(
        {
          errors: {
            hash: `invalidHash`,
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.usersService.findOne({
      id: userId,
    });

    if (!user) {
      throw new HttpException(
        {
          errors: {
            hash: `notFound`,
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.password = password;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });

    await this.usersService.update(user.id, user);
  }

  /**
   * revoke refresh token for logout action
   * @param encoded
   */
  async revokeRefreshToken(encoded: string): Promise<void> {
    // ignore exception because anyway we are going invalidate cookies
    try {
      const { token } =
        await this.refreshTokenService.resolveRefreshToken(encoded);
      if (token) {
        token.isRevoked = true;

        await this.refreshTokenService.revokeRefreshTokenById(
          token.id,
          token.userId,
        );
      }
    } catch (e) {
      throw new CustomHttpException(
        ExceptionTitleList.InvalidRefreshToken,
        HttpStatus.PRECONDITION_FAILED,
        StatusCodesList.InvalidRefreshToken,
      );
    }
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new HttpException(
          {
            errors: {
              oldPassword: 'missingOldPassword',
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const currentUser = await this.usersService.findOne({
        id: userJwtPayload.id,
      });

      if (!currentUser) {
        throw new HttpException(
          {
            errors: {
              user: 'userNotFound',
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (!currentUser.password) {
        throw new HttpException(
          {
            errors: {
              oldPassword: 'incorrectOldPassword',
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new HttpException(
          {
            errors: {
              oldPassword: 'incorrectOldPassword',
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        await this.sessionService.softDelete({
          excludeId: userJwtPayload.sessionId,
          user: {
            id: currentUser.id,
          },
        });
      }
    }

    await this.usersService.update(userJwtPayload.id, userDto);

    return this.usersService.findOne({
      id: userJwtPayload.id,
    });
  }

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    refreshTokenPayload: Partial<RefreshToken>,
  ): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          errors: {
            email: 'notFound',
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          errors: {
            password: 'incorrectPassword',
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          errors: {
            password: 'incorrectPassword',
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { refreshToken, token, tokenExpires } = await this.getTokensData({
      refreshTokenPayload,
      sessionId: session.id,
      user: user,
    });

    return { refreshToken, token, tokenExpires, user };
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
    refreshTokenPayload: Partial<RefreshToken>,
  ): Promise<LoginResponseType> {
    let user: NullableType<User> = null;
    const socialEmail = socialData.email?.toLowerCase();
    let userByEmail: NullableType<User> = null;

    if (socialEmail) {
      userByEmail = await this.usersService.findOne({
        email: socialEmail,
      });
    }

    if (socialData.id) {
      user = await this.usersService.findOne({
        provider: authProvider,
        socialId: socialData.id,
      });
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.update(user.id, user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      const role = {
        id: RoleEnum.user,
      };
      const status = {
        id: StatusEnum.active,
      };

      user = await this.usersService.create({
        email: socialEmail ?? null,
        firstName: socialData.firstName ?? null,
        lastName: socialData.lastName ?? null,
        provider: authProvider,
        role,
        socialId: socialData.id,
        status,
      });

      user = await this.usersService.findOne({
        id: user?.id,
      });
    }

    if (!user) {
      throw new HttpException(
        {
          errors: {
            user: 'userNotFound',
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const {
      refreshToken,
      token: jwtToken,
      tokenExpires,
    } = await this.getTokensData({
      refreshTokenPayload,
      sessionId: session.id,
      user: user,
    });

    return {
      refreshToken,
      token: jwtToken,
      tokenExpires,
      user,
    };
  }
}
