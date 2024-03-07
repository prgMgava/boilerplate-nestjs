import { User } from '@users/domain/user';
import { EntityCondition } from '@utils/types/entity-condition.type';

import { NullableType } from '../../../utils/types/nullable.type';
import { Session } from '../../domain/session';

export abstract class SessionRepository {
  abstract create(
    data: Omit<Session, 'createdAt' | 'deletedAt' | 'id'>,
  ): Promise<Session>;

  abstract findOne(
    options: EntityCondition<Session>,
  ): Promise<NullableType<Session>>;

  abstract softDelete({
    excludeId,
    ...criteria
  }: {
    excludeId?: Session['id'];
    id?: Session['id'];
    user?: Pick<User, 'id'>;
  }): Promise<void>;
}
