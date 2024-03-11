import { DeepPartial } from 'typeorm';

import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';

import { RefreshToken } from '@refresh-token/domain/refresh-token';

export abstract class RefreshTokenRepository {
  abstract create(
    data: Omit<RefreshToken, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>,
  ): Promise<RefreshToken>;

  abstract findOne(
    fields: EntityCondition<RefreshToken>,
  ): Promise<NullableType<RefreshToken>>;

  abstract softDelete(id: RefreshToken['id']): Promise<void>;

  abstract update(
    id: RefreshToken['id'],
    payload: DeepPartial<RefreshToken>,
  ): Promise<null | RefreshToken>;
}
