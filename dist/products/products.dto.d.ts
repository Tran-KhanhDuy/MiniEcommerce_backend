import { PagingDto } from '../common/dto/paging.dto';
export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    userId: number;
}
export declare class QueryProductDto extends PagingDto {
    userId?: number;
    search?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    userId?: number;
}
