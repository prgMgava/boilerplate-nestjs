import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { RefreshTokenInterface } from 'src/refresh-token/interface/refresh-token.interface';

import { ExceptionTitleList } from '@common/constants/exception-title-list.constants';
import { StatusCodesList } from '@common/constants/status-codes-list.constants';
import { AllConfigType } from '@config/config.type';
import { CustomHttpException } from '@exception/custom-http.exception';
import { ForbiddenException } from '@exception/forbidden.exception';
import { NotFoundException } from '@exception/not-found.exception';

import { User } from '@users/domain/user';
import { UsersService } from '@users/users.service';

import { RefreshToken } from './domain/refresh-token';
import { RefreshTokenRepository } from './infrastructure/persistence/refresh-token.repository';

// const BASE_OPTIONS: SignOptions = {
//   audience: appConfig.frontendUrl,
//   issuer: appConfig.appUrl,
// };

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userService: UsersService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  /**
   * Create access token from refresh token
   * @param refresh
   */
  public async createAccessTokenFromRefreshToken(refresh: string): Promise<{
    token: string;
    user: User;
  }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(user);
    return {
      token,
      user,
    };
  }

  /**
   * Decode refresh token
   * @param token
   */
  async decodeRefreshToken(token: string): Promise<RefreshTokenInterface> {
    try {
      return await this.jwt.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new CustomHttpException(
          ExceptionTitleList.RefreshTokenExpired,
          HttpStatus.BAD_REQUEST,
          StatusCodesList.RefreshTokenExpired,
        );
      } else {
        throw new CustomHttpException(
          ExceptionTitleList.InvalidRefreshToken,
          HttpStatus.BAD_REQUEST,
          StatusCodesList.InvalidRefreshToken,
        );
      }
    }
  }

  /**
   * Generate access token
   * @param user
   * @param isTwoFAAuthenticated
   */
  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      subject: String(user.id),
    };
    return this.jwt.signAsync({
      ...opts,
    });
  }

  /**
   * Generate refresh token
   * @param user
   * @param refreshToken
   */
  public async generateRefreshToken(
    user: User,
    refreshToken: Partial<RefreshToken>,
  ): Promise<string> {
    const tokePayload = {} as RefreshToken;
    tokePayload.userId = user.id as number;
    tokePayload.isRevoked = false;
    tokePayload.ip = refreshToken.ip;
    tokePayload.userAgent = refreshToken.userAgent;
    tokePayload.browser = refreshToken.browser;
    tokePayload.os = refreshToken.os;
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() +
        parseInt(
          this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        ),
    );
    tokePayload.expires = expiration;
    const token = await this.refreshTokenRepository.create(tokePayload);
    const opts: SignOptions = {
      jwtid: String(token.id),
      subject: String(user.id),
    };

    return this.jwt.signAsync(
      { ...opts },
      {
        expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
          infer: true,
        }),
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      },
    );
  }

  /**
   * Get refresh token entity from token payload
   * @param payload
   */
  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenInterface,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jwtid;

    if (!tokenId) {
      throw new CustomHttpException(
        ExceptionTitleList.InvalidRefreshToken,
        HttpStatus.BAD_REQUEST,
        StatusCodesList.InvalidRefreshToken,
      );
    }

    return this.refreshTokenRepository.findOne({ id: tokenId });
  }

  /**
   * Resolve encoded refresh token
   * @param encoded
   */
  public async resolveRefreshToken(encoded: string): Promise<{
    user: User;
    token: RefreshToken;
  }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
    if (!token) {
      throw new CustomHttpException(
        ExceptionTitleList.NotFound,
        HttpStatus.NOT_FOUND,
        StatusCodesList.NotFound,
      );
    }

    if (token.isRevoked) {
      throw new CustomHttpException(
        ExceptionTitleList.InvalidRefreshToken,
        HttpStatus.BAD_REQUEST,
        StatusCodesList.InvalidRefreshToken,
      );
    }

    const user = await this.userService.findOne({ id: token.userId });

    if (!user) {
      throw new CustomHttpException(
        ExceptionTitleList.InvalidRefreshToken,
        HttpStatus.BAD_REQUEST,
        StatusCodesList.InvalidRefreshToken,
      );
    }

    return {
      token,
      user,
    };
  }

  /**
   * Revoke refresh token by id
   * @param id
   * @param userId
   */
  async revokeRefreshTokenById(
    id: number,
    userId: number,
  ): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findOne({ id });
    if (!token) {
      throw new NotFoundException();
    }
    if (token.userId !== userId) {
      throw new ForbiddenException();
    }
    token.isRevoked = true;
    await this.refreshTokenRepository.update(id, token);
    return token;
  }
}
