import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityCondition } from '@utils/types/entity-condition.type';

import { RefreshToken } from '@refresh-token/domain/refresh-token';

import { NullableType } from '../../../../../utils/types/nullable.type';
import { RefreshTokenRepository } from '../../refresh-token.repository';
import { RefreshTokenSchemaClass } from '../entities/refresh-token.schema';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

@Injectable()
export class RefreshTokensDocumentRepository implements RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenSchemaClass.name)
    private readonly refreshTokensModel: Model<RefreshTokenSchemaClass>,
  ) {}

  async create(data: RefreshToken): Promise<RefreshToken> {
    const persistenceModel = RefreshTokenMapper.toPersistence(data);
    const createdUser = new this.refreshTokensModel(persistenceModel);
    const userObject = await createdUser.save();
    return RefreshTokenMapper.toDomain(userObject);
  }
  async findOne(
    fields: EntityCondition<RefreshToken>,
  ): Promise<NullableType<RefreshToken>> {
    if (fields.id) {
      const userObject = await this.refreshTokensModel.findById(fields.id);
      return userObject ? RefreshTokenMapper.toDomain(userObject) : null;
    }

    const userObject = await this.refreshTokensModel.findOne(fields);
    return userObject ? RefreshTokenMapper.toDomain(userObject) : null;
  }

  async softDelete(id: RefreshToken['id']): Promise<void> {
    await this.refreshTokensModel.deleteOne({
      _id: id,
    });
  }

  async update(
    id: RefreshToken['id'],
    payload: Partial<RefreshToken>,
  ): Promise<null | RefreshToken> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const userObject = await this.refreshTokensModel.findOneAndUpdate(
      filter,
      clonedPayload,
    );

    return userObject ? RefreshTokenMapper.toDomain(userObject) : null;
  }
}
