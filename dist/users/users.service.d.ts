import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './users.dto';
import { Users } from './users.model';
export declare class UsersService {
    private readonly usersModel;
    private readonly jwtService;
    constructor(usersModel: typeof Users, jwtService: JwtService);
    private generateJWTToken;
    login(loginDto: LoginDto, language?: string): Promise<{
        accessToken: string;
        user: {
            id: number;
            code: string;
            name: string;
            phone: string;
            role: import("../common/enums/user-role.enum").UserRole;
        };
    }>;
}
