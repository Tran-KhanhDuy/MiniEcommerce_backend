import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

import { PagingDto } from 'src/common/dto/paging.dto';
import { getLanguageValue } from 'src/common/helpers/language.helper';
import {
  CreateUserDto,
  GetUsersFilterDto,
  LoginDto,
  UpdateUserDto,
} from './users.dto';
import { Users } from './users.model';
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

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

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
        code: createUserDto.code,
      },
      paranoid: false
    });

    if (existedUser) {
      throw new BadRequestException(
        getLanguageValue(language, 'user_already_exists'),
      );
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
      throw new NotFoundException(getLanguageValue(language, 'user_not_found'));
    }

    await user.update({
      canLogin: false,
      updatedAt: new Date(),
    });

    await user.destroy();

    return {
      message: getLanguageValue(language, 'delete_user_succesful'),
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, language = 'en') {
    const user = await this.usersModel.findByPk(id);
    const { name, phone, role, canLogin } = updateUserDto;
    if (!user) {
      throw new NotFoundException(getLanguageValue(language, 'user_not_found'));
    }

    const dataUpdate: Partial<UpdateUserDto> = {
      name: name,
      phone: phone,
      role: role,
      canLogin: canLogin,
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

    if (query.role) {
      where.role = query.role;
    }

    const limit = Number(paging.limit) || 10;
    const page = Number(paging.page) || 1;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.usersModel.findAndCountAll({
      where,
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Products,
          as: 'ownedProducts',
          attributes: [
            'id',
            'name',
            'description',
            'price',
            'ownerId',
            'createdAt',
            'updatedAt',
          ],
          required: false,
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
          as: 'ownedProducts',
          attributes: [
            'id',
            'name',
            'description',
            'price',
            'ownerId',
            'createdAt',
            'updatedAt',
          ],
          required: false,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(getLanguageValue(language, 'user_not_found'));
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
