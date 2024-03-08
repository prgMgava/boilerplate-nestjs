import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllConfigType } from '@config/config.type';
import { EntityCondition } from '@utils/types/entity-condition.type';
import { NullableType } from '@utils/types/nullable.type';

import { FileType } from './domain/file';
import { FileRepository } from './infrastructure/persistence/file.repository';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileType> {
    if (!file) {
      throw new HttpException(
        {
          errors: {
            file: 'selectFile',
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`,
      s3: (file as Express.MulterS3.File).location,
    };

    return this.fileRepository.create({
      path: path[this.configService.getOrThrow('file.driver', { infer: true })],
    });
  }

  findOne(fields: EntityCondition<FileType>): Promise<NullableType<FileType>> {
    return this.fileRepository.findOne(fields);
  }
}
