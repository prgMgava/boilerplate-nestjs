import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';

import { EntityCondition } from '@utils/types/entity-condition.type';

import { RefreshToken } from '@refresh-token/domain/refresh-token';

import { NullableType } from '../../../../../utils/types/nullable.type';
import { RefreshTokenRepository } from '../../refresh-token.repository';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

@Injectable()
export class RefreshTokensRelationalRepository
  implements RefreshTokenRepository
{
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokenEntity>,
  ) {}

  async create(data: RefreshToken): Promise<RefreshToken> {
    const persistenceModel = RefreshTokenMapper.toPersistence(data);
    const newEntity = await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create(persistenceModel),
    );
    return RefreshTokenMapper.toDomain(newEntity);
  }

  async findOne(
    fields: EntityCondition<RefreshToken>,
  ): Promise<NullableType<RefreshToken>> {
    const entity = await this.refreshTokensRepository.findOne({
      where: fields as FindOptionsWhere<RefreshTokenEntity>,
    });

    return entity ? RefreshTokenMapper.toDomain(entity) : null;
  }

  async softDelete(id: RefreshToken['id']): Promise<void> {
    await this.refreshTokensRepository.softDelete(id);
  }

  async update(
    id: RefreshToken['id'],
    payload: Partial<RefreshToken>,
  ): Promise<RefreshToken> {
    const entity = await this.refreshTokensRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = RefreshTokenMapper.toPersistence({
      ...RefreshTokenMapper.toDomain(entity),
      ...payload,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.refreshTokensRepository.update(id, updatedEntity);

    return RefreshTokenMapper.toDomain(updatedEntity);
  }
}
