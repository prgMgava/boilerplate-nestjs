import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityCondition } from '@utils/types/entity-condition.type';
import { FindOptionsWhere, Not, Repository } from 'typeorm';

import { User } from '@users/domain/user';
import { UserEntity } from '@users/infrastructure/persistence/relational/entities/user.entity';

import { NullableType } from '../../../../../utils/types/nullable.type';
import { Session } from '../../../../domain/session';
import { SessionRepository } from '../../session.repository';
import { SessionEntity } from '../entities/session.entity';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class SessionRelationalRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    return this.sessionRepository.save(
      this.sessionRepository.create(persistenceModel),
    );
  }

  async findOne(
    options: EntityCondition<Session>,
  ): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: options as FindOptionsWhere<SessionEntity>,
    });

    return entity ? SessionMapper.toDomain(entity) : null;
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    excludeId?: Session['id'];
    id?: Session['id'];
    user?: Pick<User, 'id'>;
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      ...(criteria as {
        id?: SessionEntity['id'];
        user?: Pick<UserEntity, 'id'>;
      }),
      id: criteria.id
        ? (criteria.id as SessionEntity['id'])
        : excludeId
          ? Not(excludeId as SessionEntity['id'])
          : undefined,
    });
  }
}
