export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    userId: number;
}
export declare class QueryProductDto {
    page?: number;
    limit?: number;
    userId?: number;
    search?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    userId?: number;
}
