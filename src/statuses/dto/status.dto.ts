import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from 'class-validator';

import { Status } from '../domain/status';

export class StatusDto implements Status {
  @ApiProperty()
  @IsNumber()
  id: number;
}
