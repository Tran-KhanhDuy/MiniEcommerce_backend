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
const language_helper_1 = require("../common/helpers/language.helper");
const users_model_1 = require("../users/users.model");
const products_model_1 = require("./products.model");
let ProductsService = class ProductsService {
    productsModel;
    usersModel;
    constructor(productsModel, usersModel) {
        this.productsModel = productsModel;
        this.usersModel = usersModel;
    }
    async createProduct(createProductDto, language = 'en') {
        const { name, description, price, ownerId } = createProductDto;
        const owner = await this.usersModel.findByPk(ownerId, {
            attributes: ['id'],
        });
        if (!owner) {
            throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'user_not_found'));
        }
        const product = await this.productsModel.create({
            name: name,
            description: description ?? null,
            price: price ?? 0,
            ownerId: ownerId,
        });
        return product;
    }
    async findAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const offset = (page - 1) * limit;
        const keyword = query.search?.trim();
        const productWhere = {};
        if (query.ownerId) {
            productWhere.ownerId = Number(query.ownerId);
        }
        if (keyword) {
            productWhere[sequelize_2.Op.or] = [
                {
                    name: {
                        [sequelize_2.Op.like]: `%${keyword}%`,
                    },
                },
                {
                    description: {
                        [sequelize_2.Op.like]: `%${keyword}%`,
                    },
                },
            ];
        }
        const { rows, count } = await this.productsModel.findAndCountAll({
            where: productWhere,
            include: [
                {
                    model: users_model_1.Users,
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
            const product = row.get({ plain: true });
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
    async findOne(id, language = 'en') {
        const product = await this.productsModel.findByPk(id, {
            include: [
                {
                    model: users_model_1.Users,
                    as: 'owner',
                    attributes: ['id', 'code', 'name', 'phone', 'role'],
                    required: false,
                },
            ],
        });
        if (!product) {
            throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'product_not_found'));
        }
        const plainProduct = product.get({ plain: true });
        return {
            ...plainProduct,
            ownerName: plainProduct.owner?.name ?? null,
        };
    }
    async updateProduct(id, updateProductDto, language = 'en') {
        const product = await this.productsModel.findByPk(id);
        const { name, description, price, ownerId } = updateProductDto;
        if (!product) {
            throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'product_not_found'));
        }
        if (ownerId) {
            const owner = await this.usersModel.findByPk(ownerId, {
                attributes: ['id'],
            });
            if (!owner) {
                throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'user_not_found'));
            }
        }
        await product.update({
            name: name,
            description: description,
            price: price,
            ownerId: ownerId,
        });
        return this.findOne(id, language);
    }
    async deleteProduct(id, language = 'en') {
        const product = await this.productsModel.findByPk(id);
        if (!product) {
            throw new common_1.BadRequestException((0, language_helper_1.getLanguageValue)(language, 'product_not_found'));
        }
        await product.destroy();
        return {
            message: (0, language_helper_1.getLanguageValue)(language, 'product_deleted'),
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(products_model_1.Products)),
    __param(1, (0, sequelize_1.InjectModel)(users_model_1.Users)),
    __metadata("design:paramtypes", [Object, Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map