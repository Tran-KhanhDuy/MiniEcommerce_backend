import { Model } from 'sequelize-typescript';
import { Products } from "../products/products.model";
import { UserRole } from '../common/enums/user-role.enum';
export declare class Users extends Model<Users> {
    id: number;
    code: string;
    name: string;
    phone: string;
    role: UserRole;
    password: string;
    canLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Products[];
}
