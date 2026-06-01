import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { getLanguageValue } from 'src/common/helpers/language.helper';
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
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name, price, description } = createProductDto;
    const product = await this.productsModel.create({
      name: name,
      description: description ?? null,
      price: price ?? 0,
    });

    return product;
  }

  async findAll(query: QueryProductDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const keyword = query.search?.trim();

    const productWhere: WhereOptions<Products> = {};

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
      limit,
      offset,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
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

  async findOne(id: number, language = 'en') {
    const product = await this.productsModel.findByPk(id);

    if (!product) {
      throw new BadRequestException(
        getLanguageValue(language, 'product_not_found'),
      );
    }

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    language = 'en',
  ) {
    const product = await this.productsModel.findByPk(id);

    if (!product) {
      throw new BadRequestException(
        getLanguageValue(language, 'product_not_found'),
      );
    }

    await product.update(updateProductDto);

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