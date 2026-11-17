import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Users } from 'src/users/users.model';
import { SellerRequests } from './seller-requests.model';
import { SellerRequestsService } from './seller-requests.service';

@Module({
  imports: [SequelizeModule.forFeature([SellerRequests, Users])],
  providers: [SellerRequestsService],
  exports: [SequelizeModule, SellerRequestsService],
})
export class SellerRequestsModule {}