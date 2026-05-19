import { Model } from 'sequelize-typescript';
import { Products } from '../products/products.model';
import { UserRole } from '../users/user-role.enum';
export declare class Users extends Model<Users> {
    id: number;
    code: string;
    name: string;
    phone: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    products: Products[];
}
