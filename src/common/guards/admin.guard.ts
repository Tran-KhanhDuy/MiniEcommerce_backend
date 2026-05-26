import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

type AuthRequest = {
  user?: {
    id: number;
    code: string;
    role: 'ADMIN' | 'USER';
  };
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('user_not_found');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('admin_permission_required');
    }

    return true;
  }
}
