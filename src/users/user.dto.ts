import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Length,
  Matches,
} from 'class-validator';

import { UserRole } from '../common/enums/user-role.enum';

export class LoginDto {
  @ApiProperty({
    description: 'User code',
    example: 'U001',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, { message: 'code_must_not_contain_spaces' })
  code!: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique user code',
    example: 'U001',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 5, { message: 'code_must_be_from_1_to_5_character' })
  @Matches(/^\S+$/, { message: 'code_must_not_contain_spaces' })
  code!: string;

  @ApiProperty({
    description: 'User name',
    example: 'Nguyen Van A',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^\S+$/, { message: 'phone_must_not_contain_spaces' })
  phone!: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  @Matches(/^\S+$/, { message: 'role_not_contain_spaces' })

  role!: UserRole;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^\S+$/, { message: 'Password_must_not_contain_spaces' })
  password!: string;
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

  @ApiPropertyOptional({
    description: 'Can Login',
    example: 'User can login ',
  })
  @IsBoolean()
  @IsOptional()
  canLogin?: boolean;
}

export class GetUsersFilterDto {
  @ApiPropertyOptional({
    description: 'search by user name or phone',
    example: '090',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: UserRole,
    example: 'User',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
