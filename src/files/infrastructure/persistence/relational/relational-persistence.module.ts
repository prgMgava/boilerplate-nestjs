import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileRepository } from '../file.repository';
import { FileEntity } from './entities/file.entity';
import { FileRelationalRepository } from './repositories/file.repository';

@Module({
  exports: [FileRepository],
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: FileRepository,
      useClass: FileRelationalRepository,
    },
  ],
})
export class RelationalFilePersistenceModule {}
