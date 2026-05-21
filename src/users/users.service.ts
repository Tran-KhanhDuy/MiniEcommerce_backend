import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';

import { getLanguageValue } from 'src/common/helpers/language.helper';
import { CreateUserDto, LoginDto } from './users.dto';
import { Users } from './users.model';
import bcrypt from 'node_modules/bcryptjs';
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
  async createUser(createUserDto: CreateUserDto, language = 'vi') {
    const { code, name, phone, role, password } = createUserDto;

    const existedUser = await this.usersModel.findOne({
      where: {
        code,
      },
    });

    if (existedUser) {
      const message = getLanguageValue(language, 'user_already_exists');
      throw new BadRequestException(message);
    }

    const salt = await bcrypt.genSalt(
      Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    );
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.usersModel.create({
      code,
      name,
      phone,
      role,
      password: hashedPassword,
    });
    return {
      id: newUser.id,
      code: newUser.code,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
    };
  }
}
