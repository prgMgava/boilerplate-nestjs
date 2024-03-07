import { FileDto } from '@files/dto/file.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from '@roles/dto/role.dto';
import { StatusDto } from '@statuses/dto/status.dto';
import { lowerCaseTransformer } from '@utils/transformers/lower-case.transformer';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: null | string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: null | string;

  hash?: null | string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: null | string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ type: () => FileDto })
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
