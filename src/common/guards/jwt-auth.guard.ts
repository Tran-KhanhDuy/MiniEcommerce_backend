import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type AuthRequest = {
  headers: {
    authorization?: string;
  };
  user?: {
    id: number;
    code: string;
    role: 'ADMIN' | 'USER';
  };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('token_not_provided');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('invalid_token_format');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        id: number;
        code: string;
        role: 'ADMIN' | 'USER';
      }>(token, {
        secret: process.env.JWT_SECRET || 'mini-ecommerce-secret',
      });

      request.user = {
        id: payload.id,
        code: payload.code,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('invalid_or_expired_token');
    }
  }
}
