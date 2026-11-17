import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PagingDto } from 'src/common/dto/paging.dto';

import { SellerRequestStatus } from 'src/common/enums/seller-request-status.enum';
import { StringLiteral } from 'typescript';
export class CreateSellerRequestDto {
  @ApiPropertyOptional({ example: 'I want to sell handmade products ' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}

export class QuerySellerRequestDto extends PagingDto{
  @ApiPropertyOptional({ enum: SellerRequestStatus })
  @IsOptional()
  @IsEnum(SellerRequestStatus)
  status?: SellerRequestStatus;
}
