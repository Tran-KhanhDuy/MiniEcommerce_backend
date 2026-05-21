import { Users } from '../users/users.model';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './products.dto';
import { Products } from './products.model';
export declare class ProductsService {
    private usersModel;
    private productsModel;
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
}
