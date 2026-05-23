import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Users } from '../users/users.model';

export interface ProductCreationAttributes {
  name: string;
  userId: number;
  description?: string | null;
  price?: number;
}

@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true,
})
export class Products extends Model<Products, ProductCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const value = this.getDataValue('price');
      return value === null ? 0 : Number(value);
    },
  })
  declare price: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => Users)
  declare user: Users;
}
