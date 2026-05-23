import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { PagingDto } from '../common/dto/paging.dto';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    userId!: number;
}
export class QueryProductDto extends PagingDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId?: number;

    @IsOptional()
    @IsString()
    search?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;
}