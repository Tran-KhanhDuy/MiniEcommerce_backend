import { Users } from '../users/users.model';
import { CreateProductDto, QueryProductDto } from './products.dto';
import { Products } from './products.model';
export declare class ProductsService {
    private usersModel;
    private productsModel;
    constructor(usersModel: typeof Users, productsModel: typeof Products);
    create(createProductDto: CreateProductDto): Promise<Products>;
    findAll(query: QueryProductDto): Promise<{
        items: Products[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Products>;
}
