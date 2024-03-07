import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';
import { FindOptionsWhere, Repository } from 'typeorm';

import { FileType } from '../../../../domain/file';
import { FileRepository } from '../../file.repository';
import { FileEntity } from '../entities/file.entity';
import { FileMapper } from '../mappers/file.mapper';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: FileType): Promise<FileType> {
    const persistenceModel = FileMapper.toPersistence(data);
    return this.fileRepository.save(
      this.fileRepository.create(persistenceModel),
    );
  }

  async findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>> {
    const entity = await this.fileRepository.findOne({
      where: fields as FindOptionsWhere<FileEntity>,
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }
}
