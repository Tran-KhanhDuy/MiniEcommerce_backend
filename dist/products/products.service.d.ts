import { Users } from "../users/users.model";
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './products.dto';
import { Products } from './products.model';
export declare class ProductsService {
    private readonly productsModel;
    private readonly usersModel;
    constructor(productsModel: typeof Products, usersModel: typeof Users);
    createProduct(createProductDto: CreateProductDto, language?: string): Promise<Products>;
    findAll(query: QueryProductDto): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number, language?: string): Promise<any>;
    updateProduct(id: number, updateProductDto: UpdateProductDto, language?: string): Promise<any>;
    deleteProduct(id: number, language?: string): Promise<{
        message: string;
    }>;
}
