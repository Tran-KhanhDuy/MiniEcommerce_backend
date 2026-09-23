import {
    AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Products } from 'src/products/products.model';
import { Orders } from './orders.model';

export interface OrderDetailsCreationAttributes {
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
    totalPrice: number,
}

@Table({
    tableName: 'order_details',
    timestamps: true,
    paranoid: false,
})
export class OrderDetails extends Model <
    OrderDetails,
    OrderDetailsCreationAttributes
> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Orders )
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare orderId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1,
    })
    declare quantity: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        get(this: OrderDetails) {
            const value = this.getDataValue('price') as string | number | null;
            return value === null ? 0 : Number (value);
        },
    })
    declare price: number;

    @Column({
        type: DataType.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 0,
        get(this: OrderDetails) {
            const value = this.getDataValue('totalPrice') as string | number | null;
            return value === null ? 0 : Number(value);
        },
    })
    declare totalPrice: number;

    @BelongsTo(() => Orders, {
        foreignKey: 'orderId',
        as: 'order',
    })
    declare order: Orders;

    @BelongsTo(() => Products,{
        foreignKey: 'productId', 
        as: 'product',
    })
    declare product: Products;

    @CreatedAt
    @Column(DataType.DATE)
    declare createdAt: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    declare updatedAt: Date;
}