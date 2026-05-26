import { Users } from '../users/user.model';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './products.dto';
import { Products } from './products.model';
export declare class ProductsService {
    private readonly usersModel;
    private readonly productsModel;
    constructor(usersModel: typeof Users, productsModel: typeof Products);
    createProduct(createProductDto: CreateProductDto): Promise<Products>;
    findAll(query: QueryProductDto): Promise<{
        items: Products[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Products>;
    updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Products>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
}
