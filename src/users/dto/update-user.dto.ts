import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { lowerCaseTransformer } from '@utils/transformers/lower-case.transformer';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

import { FileDto } from '@files/dto/file.dto';
import { RoleDto } from '@roles/dto/role.dto';
import { StatusDto } from '@statuses/dto/status.dto';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: null | string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: null | string;

  hash?: null | string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: null | string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ type: FileDto })
  @IsOptional()
  photo?: FileDto | null;

  provider?: string;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: null | RoleDto;

  socialId?: null | string;

  @ApiProperty({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}
