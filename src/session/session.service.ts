import { Injectable } from '@nestjs/common';

import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';

import { User } from '@users/domain/user';

import { Session } from './domain/session';
import { SessionRepository } from './infrastructure/persistence/session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  create(
    data: Omit<Session, 'createdAt' | 'deletedAt' | 'id'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  findOne(options: EntityCondition<Session>): Promise<NullableType<Session>> {
    return this.sessionRepository.findOne(options);
  }

  async softDelete(criteria: {
    excludeId?: Session['id'];
    id?: Session['id'];
    user?: Pick<User, 'id'>;
  }): Promise<void> {
    await this.sessionRepository.softDelete(criteria);
  }
}
