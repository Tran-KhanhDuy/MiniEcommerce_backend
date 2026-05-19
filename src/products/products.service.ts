import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { Users } from '../users/users.model';
import { CreateProductDto, QueryProductDto } from './products.dto';
import { Products } from './products.model';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Users)
        private usersModel: typeof Users,

        @InjectModel(Products)
        private productsModel: typeof Products,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const user = await this.usersModel.findByPk(createProductDto.userId);

        if (!user) {
            throw new BadRequestException('User does not exist');
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
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const productWhere: WhereOptions<Products> = {};

        if (query.userId) {
            productWhere.userId = query.userId;
        }

        const userWhere = query.search
            ? {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${query.search}%`,
                        },
                    },
                    {
                        phone: {
                            [Op.like]: `%${query.search}%`,
                        },
                    },
                ],
            }
            : undefined;

        const { rows, count } = await this.productsModel.findAndCountAll({
            where: productWhere,
            include: [
                {
                    model: Users,
                    attributes: ['id', 'code', 'name', 'phone', 'role'],
                    required: Boolean(query.search),
                    where: userWhere,
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
                    attributes: ['id', 'code', 'name', 'phone', 'role'],
                },
            ],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }
}
