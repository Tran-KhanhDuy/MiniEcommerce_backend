import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Products } from 'src/products/products.model';
import { Users } from 'src/users/users.model';
import { OrderDetails } from './order-details.model';
import { Orders } from './orders.model';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
@Module({
  imports: [
    SequelizeModule.forFeature([Orders, OrderDetails, Users, Products]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtAuthGuard, AdminGuard],
  exports: [OrdersService],
})
export class OrdersModule {}
