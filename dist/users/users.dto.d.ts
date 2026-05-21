import { UserRole } from '../common/enums/user-role.enum';
export declare class LoginDto {
    code: string;
    password: string;
}
export declare class CreateUserDto {
    code: string;
    name: string;
    phone: string;
    role: UserRole;
    password: string;
}
export declare class UpdateUserDto {
    code?: string;
    name?: string;
    phone?: string;
    role?: UserRole;
    password?: string;
}
export declare class QueryUserDto {
    search?: string;
}
export declare class GetUsersFilterDto {
    role?: UserRole;
}
