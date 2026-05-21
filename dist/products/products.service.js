"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const users_model_1 = require("../users/users.model");
const products_model_1 = require("./products.model");
let ProductsService = class ProductsService {
    usersModel;
    productsModel;
    constructor(usersModel, productsModel) {
        this.usersModel = usersModel;
        this.productsModel = productsModel;
    }
    async createProduct(createProductDto) {
        const user = await this.usersModel.findByPk(createProductDto.userId);
        if (!user) {
            throw new common_1.BadRequestException('User does not exist');
        }
        const product = await this.productsModel.create({
            name: createProductDto.name,
            description: createProductDto.description ?? null,
            price: createProductDto.price ?? 0,
            userId: createProductDto.userId,
        });
        return product;
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;
        const productWhere = {};
        if (query.userId) {
            productWhere.userId = query.userId;
        }
        const userWhere = query.search
            ? {
                [sequelize_2.Op.or]: [
                    {
                        name: {
                            [sequelize_2.Op.like]: `%${query.search}%`,
                        },
                    },
                    {
                        phone: {
                            [sequelize_2.Op.like]: `%${query.search}%`,
                        },
                    },
                ],
            }
            : undefined;
        const { rows, count } = await this.productsModel.findAndCountAll({
            where: productWhere,
            include: [
                {
                    model: users_model_1.Users,
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
    async findOne(id) {
        const product = await this.productsModel.findByPk(id, {
            include: [
                {
                    model: users_model_1.Users,
                    attributes: ['id', 'code', 'name', 'phone', 'role'],
                },
            ],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateProduct(id, updateProductDto) {
        const product = await this.productsModel.findByPk(id);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (updateProductDto.userId) {
            const user = await this.usersModel.findByPk(updateProductDto.userId);
            if (!user) {
                throw new common_1.BadRequestException('User does not exist');
            }
        }
        await product.update({
            name: updateProductDto.name ?? product.name,
            description: updateProductDto.description !== undefined
                ? updateProductDto.description
                : product.description,
            price: updateProductDto.price ?? product.price,
            userId: updateProductDto.userId ?? product.userId,
        });
        return this.findOne(id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(users_model_1.Users)),
    __param(1, (0, sequelize_1.InjectModel)(products_model_1.Products)),
    __metadata("design:paramtypes", [Object, Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map