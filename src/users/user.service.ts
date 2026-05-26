import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { compare } from 'bcryptjs';

import { getLanguageValue } from 'src/common/helpers/language.helper';
import {
  CreateUserDto,
  GetUsersFilterDto,
  LoginDto,
  UpdateUserDto,
} from './user.dto';
import { Users } from './user.model';
import * as bcrypt from 'node_modules/bcryptjs';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Model, Op } from 'sequelize';
import { Products } from 'src/products/products.model';
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

  async login(loginDto: LoginDto, language = 'en') {
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
  async createUser(createUserDto: CreateUserDto, language = 'en') {
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
  async deleteUser(id: number, language = 'en') {
    const user = await this.usersModel.findByPk(id);

    if (!user) {
      const message = getLanguageValue(language, 'user_not_found');
      throw new NotFoundException(message);
    }

    await this.usersModel.update(
      {
        canLogin: false,
        updatedAt: new Date(),
      },
      {
        where: {
          id,
        },
      },
    );
    await user.destroy();

    return {
      message: getLanguageValue(language, 'delete_user_succesful'),
    };
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto, language = 'en') {
    const user = await this.usersModel.findByPk(id);

    if (!user) {
      const message = getLanguageValue(language, 'user_not_found');
      throw new NotFoundException(message);
    }

    if (updateUserDto.code && updateUserDto.code !== user.code) {
      const existedUser = await this.usersModel.findOne({
        where: {
          code: updateUserDto.code,
        },
      });

      if (existedUser) {
        const message = getLanguageValue(language, 'user_already_exists');
        throw new BadRequestException(message);
      }
    }

    const dataUpdate: Partial<UpdateUserDto> = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(
        Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
      );

      dataUpdate.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await user.update(dataUpdate);

    return {
      id: user.id,
      code: user.code,
      name: user.name,
      phone: user.phone,
      role: user.role,
      canLogin: user.canLogin,
    };
  }
  async findAllUser(query: GetUsersFilterDto, paging: PagingDto) {
    const where: Record<PropertyKey, unknown> = {};

    const keyword = query.search?.trim();

    if (keyword) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          code: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const limit = Number(paging.limit) || 10;
    const page = Number(paging.page) || 1;
    const offset = (page - 1) * limit;

    const result = await this.usersModel.findAndCountAll({
      where,
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Products,
          attributes: [
            'id',
            'name',
            'description',
            'price',
            'userId',
            'createdAt',
          ],
        },
      ],
      limit,
      offset,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
      distinct: true,
    });

    const { count, rows } = result;

    return {
      items: rows.map((row) => row.get({ plain: true })),
      total: count,
      limit,
      offset,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }
  async findOneUser(id: number, language = 'en') {
    const user = await this.usersModel.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Products,
          attributes: [
            'id',
            'name',
            'description',
            'price',
            'userId',
            'createdAt',
            'updatedAt',
          ],
        },
      ],
    });

    if (!user) {
      const message = getLanguageValue(language, 'user_not_found');
      throw new NotFoundException(message);
    }

    return {
      message: getLanguageValue(language, 'user_found'),
      data: {
        id: user.id,
        code: user.code,
        name: user.name,
        phone: user.phone,
        role: user.role,
        canLogin: user.canLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
