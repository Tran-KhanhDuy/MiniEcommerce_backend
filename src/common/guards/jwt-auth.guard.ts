import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

type JwtPayload = {
  id: number;
  code: string;
  role: 'ADMIN' | 'USER';
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new UnauthorizedException('jwt_secret_not_configured');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtSecret,
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
