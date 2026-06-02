import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { getLanguageValue } from 'src/common/helpers/language.helper';
import { Users } from 'src/users/users.model';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from './products.dto';
import { Products } from './products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products)
    private readonly productsModel: typeof Products,

    @InjectModel(Users)
    private readonly usersModel: typeof Users,
  ) {}

  async createProduct(createProductDto: CreateProductDto, language = 'en') {
    const { name, description, price, ownerId } = createProductDto;
    
    const owner = await this.usersModel.findByPk(ownerId, {
      attributes: ['id'],
    });

    if (!owner) {
      throw new BadRequestException(
        getLanguageValue(language, 'user_not_found'),
      );
    }

    const product = await this.productsModel.create({
      name,
      description: description ?? null,
      price: price ?? 0,
      ownerId,
    });

    return product;
  }

  async findAll(query: QueryProductDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const keyword = query.search?.trim();
    const productWhere: WhereOptions<Products> = {};

    if (query.ownerId) {
      productWhere.ownerId = Number(query.ownerId);
    }

    if (keyword) {
      productWhere[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const { rows, count } = await this.productsModel.findAndCountAll({
      where: productWhere,
      include: [
        {
          model: Users,
          as: 'owner',
          attributes: ['id', 'code', 'name', 'phone', 'role'],
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

    const items = rows.map((row) => {
      const product = row.get({ plain: true }) as any;

      return {
        ...product,
        ownerName: product.owner?.name ?? null,
      };
    });

    return {
      items,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number, language = 'en') {
    const product = await this.productsModel.findByPk(id, {
      include: [
        {
          model: Users,
          as: 'owner',
          attributes: ['id', 'code', 'name', 'phone', 'role'],
          required: false,
        },
      ],
    });

    if (!product) {
      throw new BadRequestException(
        getLanguageValue(language, 'product_not_found'),
      );
    }

    const plainProduct = product.get({ plain: true }) as any;

    return {
      ...plainProduct,
      ownerName: plainProduct.owner?.name ?? null,
    };
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    language = 'en',
  ) {
    const product = await this.productsModel.findByPk(id);
    const { name, description, price, ownerId } = updateProductDto;

    if (!product) {
      throw new BadRequestException(
        getLanguageValue(language, 'product_not_found'),
      );
    }
    
    if (ownerId) {
      const owner = await this.usersModel.findByPk(ownerId, {
        attributes: ['id'],
      });

      if (!owner) {
        throw new BadRequestException(
          getLanguageValue(language, 'user_not_found'),
        );
      }
    }

    await product.update({
      name,
      description,
      price,
      ownerId,
    });

    return this.findOne(id, language);
  }

  async deleteProduct(id: number, language = 'en') {
    const product = await this.productsModel.findByPk(id);

    if (!product) {
      throw new BadRequestException(
        getLanguageValue(language, 'product_not_found'),
      );
    }

    await product.destroy();

    return {
      message: getLanguageValue(language, 'product_deleted'),
    };
  }
}