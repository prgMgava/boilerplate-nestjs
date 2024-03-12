import { RefreshToken } from 'src/refresh-token/domain/refresh-token';

import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export class RefreshTokenMapper {
  static toDomain(raw: RefreshTokenEntity): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.id = raw.id;
    refreshToken.browser = raw.browser;
    refreshToken.expires = raw.expires;
    refreshToken.ip = raw.ip;
    refreshToken.isRevoked = raw.isRevoked;
    refreshToken.os = raw.os;
    refreshToken.userId = raw.userId;
    refreshToken.createdAt = raw.createdAt;
    refreshToken.updatedAt = raw.updatedAt;
    refreshToken.deletedAt = raw.deletedAt;
    refreshToken.userAgent = raw.userAgent;

    return refreshToken;
  }

  static toPersistence(refreshToken: RefreshToken): RefreshTokenEntity {
    const refreshTokenEntity = new RefreshTokenEntity();
    if (refreshToken.id && typeof refreshToken.id === 'number') {
      refreshTokenEntity.id = refreshToken.id;
    }
    refreshTokenEntity.browser = refreshToken.browser;
    refreshTokenEntity.expires = refreshToken.expires;
    refreshTokenEntity.ip = refreshToken.ip;
    refreshTokenEntity.isRevoked = refreshToken.isRevoked;
    refreshTokenEntity.userAgent = refreshToken.userAgent;
    refreshTokenEntity.userId = refreshToken.userId;
    refreshTokenEntity.os = refreshToken.os;
    refreshTokenEntity.createdAt = refreshToken.createdAt;
    refreshTokenEntity.updatedAt = refreshToken.updatedAt;
    refreshTokenEntity.deletedAt = refreshToken.deletedAt;
    return refreshTokenEntity;
  }
}
