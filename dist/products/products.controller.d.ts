import { CreateProductDto, QueryProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./products.model").Products>;
    findAll(query: QueryProductDto): Promise<{
        items: import("./products.model").Products[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("./products.model").Products>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<import("./products.model").Products>;
}
