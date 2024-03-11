import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsString, Min, ValidateIf } from 'class-validator';

export class RefreshPaginateFilterDto {
  @ApiPropertyOptional()
  @ValidateIf((object, value) => value)
  @IsString()
  keywords: string;

  @ApiPropertyOptional()
  @ValidateIf((object, value) => value)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}',
  })
  limit: number;

  @ApiPropertyOptional()
  @ValidateIf((object, value) => value)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'min-{"ln":1,"count":1}',
  })
  page: number;
}
