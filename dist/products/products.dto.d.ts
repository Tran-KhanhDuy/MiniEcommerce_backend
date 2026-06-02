export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    ownerId: number;
}
export declare class QueryProductDto {
    page?: number;
    limit?: number;
    ownerId?: number;
    search?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    ownerId?: number;
}
