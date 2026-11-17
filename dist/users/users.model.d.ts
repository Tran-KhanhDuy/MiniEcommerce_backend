import { Model } from 'sequelize-typescript';
import type { Optional } from 'sequelize';
import { Products } from "../products/products.model";
import { UserRole } from '../common/enums/user-role.enum';
export type UsersAttributes = {
    id: number;
    code: string;
    name: string;
    phone: string;
    role: UserRole;
    password: string;
    canLogin: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
export type UsersCreationAttributes = Optional<UsersAttributes, 'id' | 'role' | 'canLogin' | 'createdAt' | 'updatedAt'>;
export declare class Users extends Model<UsersAttributes, UsersCreationAttributes> {
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
