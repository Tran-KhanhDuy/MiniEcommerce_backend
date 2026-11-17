import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { OrderStatus } from 'src/common/enums/order-status.enum';
import { getLanguageValue } from 'src/common/helpers/language.helper';
import { Products } from 'src/products/products.model';
import { Users } from 'src/users/users.model';
import { OrderDetails } from './order-details.model';
import { CreateOrderDto, QueryOrderDto } from './orders.dto';
import { Orders } from './orders.model';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    private readonly sequelize: Sequelize,

    @InjectModel(Orders)
    private readonly ordersModel: typeof Orders,

    @InjectModel(OrderDetails)
    private readonly orderDetailsModel: typeof OrderDetails,

    @InjectModel(Users)
    private readonly usersModel: typeof Users,

    @InjectModel(Products)
    private readonly productsModel: typeof Products,
  ) {}

  private getOrderInclude() {
    return [
      {
        model: Users,
        as: 'buyer',
        attributes: ['id', 'code', 'email', 'name', 'phone', 'role'],
      },
      {
        model: OrderDetails,
        as: 'orderDetails',
        include: [
          {
            model: Products,
            as: 'product',
            attributes: ['id', 'name', 'description', 'price', 'ownerId'],
          },
        ],
      },
    ];
  }
  
  private async findOrderOrFail(id: number, language = 'en') {
    const order = await this.ordersModel.findByPk(id);

    if (!order) {
      throw new BadRequestException(
        getLanguageValue(language, 'order_not_found'),
      );
    }

    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto, language = 'en') {
    const { buyerId, items } = createOrderDto;

    const buyer = await this.usersModel.findByPk(buyerId, {
      attributes: ['id'],
    });

    if (!buyer) {
      throw new BadRequestException(
        getLanguageValue(language, 'user_not_found'),
      );
    }

    const orderId = await this.sequelize.transaction(async (transaction) => {
      const orderItems: {
        productId: number;
        quantity: number;
        price: number;
        totalPrice: number;
      }[] = [];

      let totalAmount = 0;

      for (const item of items) {
        const product = await this.productsModel.findByPk(item.productId, {
          attributes: ['id', 'price'],
          transaction,
        });

        if (!product) {
          throw new BadRequestException(
            getLanguageValue(language, 'product_not_found'),
          );
        }

        const price = Number(product.price);
        const quantity = item.quantity;
        const totalPrice = price * quantity;

        totalAmount += totalPrice;

        orderItems.push({
          productId: product.id,
          quantity,
          price,
          totalPrice,
        });
      }

      const order = await this.ordersModel.create(
        {
          buyerId,
          totalAmount,
          status: OrderStatus.PENDING,
        },
        { transaction },
      );

      const orderDetails = orderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      }));

      await this.orderDetailsModel.bulkCreate(orderDetails, {
        transaction,
      });

      return order.id;
    });

    return this.findOne(orderId, language);
  }

  async findOne(id: number, language = 'en') {
    const order = await this.ordersModel.findByPk(id, {
      include: this.getOrderInclude(),
    });

    if (!order) {
      throw new BadRequestException(
        getLanguageValue(language, 'order_not_found'),
      );
    }

    return order;
  }
  async findAll(query: QueryOrderDto) {
    const orderWhere: WhereOptions<Orders> = {};

    if (query.buyerId) {
      orderWhere.buyerId = Number(query.buyerId);
    }

    if (query.fromDate || query.toDate) {
      const createdAtWhere: any = {};

      if (query.fromDate) {
        createdAtWhere[Op.gte] = new Date(`${query.fromDate}T00:00:00`);
      }

      if (query.toDate) {
        createdAtWhere[Op.lte] = new Date(`${query.toDate}T23:59:59.999`);
      }

      orderWhere.createdAt = createdAtWhere;
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.ordersModel.findAndCountAll({
      where: orderWhere,
      include: this.getOrderInclude(),
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
  async cancelOrder(id: number, language = 'en') {
    const order = await this.findOrderOrFail(id, language);

    await order.update({
      status: OrderStatus.CANCELLED,
    });

    return this.findOne(id, language);
  }

  async payOrder(id: number, language = 'en') {
    const order = await this.findOrderOrFail(id, language);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        getLanguageValue(language, 'order_has_been_cancelled'),
      );
    }

    await order.update({
      status: OrderStatus.PAID,
    });

    return this.findOne(id, language);
  }
}
