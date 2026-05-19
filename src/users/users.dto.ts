import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { UserRole } from '../common/enums/user-role.enum';

export class LoginDto {
  @ApiProperty({
    description: 'User code',
    example: 'U001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique user code',
    example: 'U001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'User name',
    example: 'Nguyen Van A',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Unique user code',
    example: 'U001',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({
    description: 'User name',
    example: 'Nguyen Van A',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '0901234567',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  password?: string;
}

export class QueryUserDto {
  @ApiPropertyOptional({
    description: 'Search by user name or phone',
    example: '090',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
