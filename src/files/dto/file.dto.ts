import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { FileType } from '../domain/file';

export class FileDto implements FileType {
  @ApiProperty()
  @IsString()
  id: string;

  path: string;
}
