import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityCondition } from '@utils/types/entity-condition.type';

import { User } from '@users/domain/user';

import { NullableType } from '../../../../../utils/types/nullable.type';
import { Session } from '../../../../domain/session';
import { SessionRepository } from '../../session.repository';
import { SessionSchemaClass } from '../entities/session.schema';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class SessionDocumentRepository implements SessionRepository {
  constructor(
    @InjectModel(SessionSchemaClass.name)
    private sessionModel: Model<SessionSchemaClass>,
  ) {}

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const createdSession = new this.sessionModel(persistenceModel);
    const sessionObject = await createdSession.save();
    return SessionMapper.toDomain(sessionObject);
  }

  async findOne(
    fields: EntityCondition<Session>,
  ): Promise<NullableType<Session>> {
    if (fields.id) {
      const sessionObject = await this.sessionModel.findById(fields.id);
      return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
    }

    const sessionObject = await this.sessionModel.findOne(fields);
    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    excludeId?: Session['id'];
    id?: Session['id'];
    user?: Pick<User, 'id'>;
  }): Promise<void> {
    const transformedCriteria = {
      _id: criteria.id
        ? criteria.id
        : excludeId
          ? { $not: { $eq: excludeId } }
          : undefined,
      user: criteria.user?.id,
    };
    await this.sessionModel.deleteMany(transformedCriteria);
  }
}
