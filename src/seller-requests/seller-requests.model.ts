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

import { SellerRequestStatus } from 'src/common/enums/seller-request-status.enum';
import { Users } from 'src/users/users.model';

export interface SellerRequestCreationAttributes {
  userId: number;
  reason?: string | null;
  status?: SellerRequestStatus;
  reviewedBy?: number | null;
  reviewedAt?: Date | null;
}

@Table({
  tableName: 'seller_request',
  timestamps: true,
})
export class SellerRequests extends Model<
  SellerRequests,
  SellerRequestCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @Column({
    type: DataType.ENUM(
      SellerRequestStatus.PENDING,
      SellerRequestStatus.APPROVED,
      SellerRequestStatus.REJECCTED,
    ),
    allowNull: false,
    defaultValue: SellerRequestStatus.PENDING,
  })
  declare status: SellerRequestStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare reason: string | null;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare reviewedBy: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare reviewedAt: Date | null;

  @BelongsTo(() => Users, {
    foreignKey: 'userId',
    as: 'user',
  })
  declare user: Users;

  @BelongsTo(() => Users, {
    foreignKey: 'reviewedBy',
    as: 'reviewer',
  })
  declare reviewer: Users;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
