import { RefreshToken } from '@refresh-token/domain/refresh-token';

import { RefreshTokenSchemaClass } from '../entities/refresh-token.schema';

export class RefreshTokenMapper {
  static toDomain(raw: RefreshTokenSchemaClass): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.id = raw._id;
    refreshToken.browser = raw.browser;
    refreshToken.ip = raw.ip;
    refreshToken.expires = raw.expires;
    refreshToken.isRevoked = raw.isRevoked;
    refreshToken.os = raw.os;
    refreshToken.userAgent = raw.userAgent;
    refreshToken.userId = raw.userId;
    refreshToken.createdAt = raw.createdAt;
    refreshToken.updatedAt = raw.updatedAt;
    refreshToken.deletedAt = raw.deletedAt;
    return refreshToken;
  }

  static toPersistence(refreshToken: RefreshToken): RefreshTokenSchemaClass {
    const userEntity = new RefreshTokenSchemaClass();
    userEntity._id = refreshToken.id;
    userEntity.browser = refreshToken.browser;
    userEntity.ip = refreshToken.ip;
    userEntity.expires = refreshToken.expires;
    userEntity.isRevoked = refreshToken.isRevoked;
    userEntity.os = refreshToken.os;
    userEntity.userAgent = refreshToken.userAgent;
    userEntity.userId = refreshToken.userId;
    userEntity.createdAt = refreshToken.createdAt;
    userEntity.updatedAt = refreshToken.updatedAt;
    userEntity.deletedAt = refreshToken.deletedAt;
    return userEntity;
  }
}
