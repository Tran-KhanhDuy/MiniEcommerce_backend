import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';

import { getLanguageValue } from 'src/common/helpers/language.helper';
import { LoginDto } from './users.dto';
import { Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    private readonly jwtService: JwtService,
  ) {}

  private generateJWTToken(user: Users): string {
    const payload = {
      id: user.id,
      code: user.code,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto, language = 'vi') {
    const user = await this.usersModel.findOne({
      where: {
        code: loginDto.code,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        getLanguageValue(language, 'login_failed'),
      );
    }

    if (!user.canLogin) {
      throw new BadRequestException(
        getLanguageValue(language, 'account_locked'),
      );
    }

    if (!user.password) {
      throw new BadRequestException(
        getLanguageValue(language, 'account_is_not_registered'),
      );
    }

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        getLanguageValue(language, 'invalid_password'),
      );
    }

    const accessToken = this.generateJWTToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        code: user.code,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
