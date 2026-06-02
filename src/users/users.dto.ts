import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
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
    description: 'Email',
    example: 'example@email.com',
  })
  @IsEmail({}, { message: 'email_invalid' })
  @IsNotEmpty({ message: 'email_required' })
  email!: string;

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
  @Length(1, 11, { message: 'phone_must_be_from_1_to_11_number' })
  phone!: string;

  @ApiProperty({
    description: 'Email',
    example: 'example@email.com',
  })
  @IsEmail({}, { message: 'email_invalid' })
  @IsNotEmpty({ message: 'email_required' })
  email!: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty({ message: 'role_required' })
  role!: UserRole;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^\S+$/, { message: 'password_must_not_contain_spaces' })
  password!: string;
}

export class UpdateUserDto {
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
    example: UserRole.CUSTOMER,
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
