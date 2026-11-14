import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Users } from 'src/users/users.model';
import { SellerRequests } from './seller-requests.model';

@Module({
  imports: [SequelizeModule.forFeature([SellerRequests, Users])],
  exports: [SequelizeModule],
})
export class SellerRequestsModule {}