import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';

import { UserRole } from '../common/enums/user-role.enum';
import { Products } from 'src/products/products.model';

export type UsersAttributes = {
  id: number;
  code: string;
  name: string;
  phone: string;
  role: UserRole;
  password: string;
  canLogin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type UsersCreationAttributes = Optional<
  UsersAttributes,
  'id' | 'role' | 'canLogin' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: false,
  deletedAt: 'deletedAt',
})
export class Users extends Model<UsersAttributes, UsersCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare code: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.ENUM(UserRole.ADMIN, UserRole.CUSTOMER),
    allowNull: false,
    defaultValue: UserRole.CUSTOMER,
  })
  declare role: UserRole;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare canLogin: boolean;

  @HasMany(() => Products, {
    foreignKey: 'ownerId',
    as: 'ownedProducts',
  })
  declare ownedProducts: Products[];

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