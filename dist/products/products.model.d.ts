import { Model } from 'sequelize-typescript';
import { Users } from '../users/users.model';
export interface ProductCreationAttributes {
    name: string;
    userId: number;
    description?: string | null;
    price?: number;
}
export declare class Products extends Model<Products, ProductCreationAttributes> {
    id: number;
    name: string;
    description: string | null;
    price: number;
    userId: number;
    user: Users;
}
