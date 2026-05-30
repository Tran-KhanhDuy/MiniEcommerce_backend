import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { Users } from '../users/user.model';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from './products.dto';
import { Products } from './products.model';
import { getLanguageValue } from 'src/common/helpers/language.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    @InjectModel(Products)
    private readonly productsModel: typeof Products,
  ) {}

  async createProduct(createProductDto: CreateProductDto, language = 'en') {
  const user = await this.usersModel.findOne({
    where: {
      id: createProductDto.userId,
      canLogin: true,
    },
    attributes: ['id'],
  });

  if (!user) {
    throw new BadRequestException(
      getLanguageValue(language, 'user_not_found'),
    );
  }

  const product = await this.productsModel.create({
    name: createProductDto.name,
    description: createProductDto.description ?? null,
    price: createProductDto.price ?? 0,
    userId: createProductDto.userId,
  });

  return product;
}

  async findAll(query: QueryProductDto) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const { userId, search } = query;
  const keyword = search?.trim();

  const productWhere: WhereOptions<Products> = {};

  if (userId) {
    productWhere.userId = Number(userId);
  }

  if (keyword) {
    Object.assign(productWhere, {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          '$user.name$': {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          '$user.phone$': {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    });
  }

  const { rows, count } = await this.productsModel.findAndCountAll({
    where: productWhere,
    include: [
      {
        model: Users,
        attributes: [ 'code', 'name', 'phone', 'role'],
        required: false,
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  return {
    items: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

  async findOne(id: number) {
    const product = await this.productsModel.findByPk(id, {
      include: [
        {
          model: Users,
          attributes: ['code', 'name', 'phone', 'role'],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsModel.findByPk(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.userId) {
      const user = await this.usersModel.findByPk(updateProductDto.userId, {
        attributes: ['id'],
      });

      if (!user) {
        throw new BadRequestException('User does not exist');
      }
    }

    await product.update(updateProductDto);

    return this.findOne(id);
  }

  async deleteProduct(id: number) {
    const product = await this.productsModel.findByPk(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await product.destroy();

    return {
      message: 'Product deleted successfully',
    };
  }
}