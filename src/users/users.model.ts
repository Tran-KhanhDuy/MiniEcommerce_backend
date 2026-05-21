import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';

import { Products } from 'src/products/products.model';
import { UserRole } from '../common/enums/user-role.enum';

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
};

export type UsersCreationAttributes = Optional<
  UsersAttributes,
  'id' | 'role' | 'canLogin' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: false,
  underscored: false,
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
    type: DataType.ENUM(UserRole.ADMIN, UserRole.USER),
    allowNull: false,
    defaultValue: UserRole.USER,
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

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt?: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @HasMany(() => Products)
  declare products: Products[];
}
