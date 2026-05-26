import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Users } from '../users/user.model';
import { ProductsController } from './products.controller';
import { Products } from './products.model';
import { ProductsService } from './products.service';

@Module({
  imports: [SequelizeModule.forFeature([Products, Users])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
