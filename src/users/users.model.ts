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

import { Products } from 'src/products/products.model';
import { UserRole } from '../common/enums/user-role.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: false,
  underscored: false,
})
export class Users extends Model<Users> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.UUID)
  declare id: number;
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;
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

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @HasMany(() => Products)
  declare products: Products[];
}
