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
