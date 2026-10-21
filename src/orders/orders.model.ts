import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { OrderStatus } from 'src/common/enums/order-status.enum';
import { Users } from 'src/users/users.model';
import { OrderDetails } from './order-details.model';

export interface OrderCreationAttributes {
  buyerId: number;
  totalAmount?: number;
  status?: OrderStatus;
}

@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
})
export class Orders extends Model<Orders, OrderCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare buyerId: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    get(this: Orders) {
      const value = this.getDataValue('totalAmount') as string | number | null;
      return value === null ? 0 : Number(value);
    },
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM(
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.CANCELLED,
    ),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  })
  declare status: OrderStatus;

  @BelongsTo(() => Users, {
    foreignKey: 'buyerId',
    as: 'buyer',
  })
  declare buyer: Users;

  @HasMany(() => OrderDetails, {
    foreignKey: 'orderId',
    as: 'orderDetails',
  })
  declare orderDetails: OrderDetails[];

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  declare deletedAt?: Date;
}