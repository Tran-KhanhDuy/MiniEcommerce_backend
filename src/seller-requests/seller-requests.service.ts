import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SellerRequestStatus } from 'src/common/enums/seller-request-status.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { getLanguageValue } from 'src/common/helpers/language.helper';
import { Users } from 'src/users/users.model';
import { CreateSellerRequestDto } from './seller-requests.dto';
import { SellerRequests } from './seller-requests.model';

@Injectable()
export class SellerRequestsService {
  constructor(
    @InjectModel(SellerRequests)
    private readonly sellerRequestsModel: typeof SellerRequests,

    @InjectModel(Users)
    private readonly usersModel: typeof Users,
  ) {}

  async createRequest(
    createSellerRequestDto: CreateSellerRequestDto,
    userId: number,
    language = 'en',
  ) {
    const { reason } = createSellerRequestDto;

    // 1. Load the user from the database, including 'role'
    const user = await this.usersModel.findByPk(userId, {
      attributes: ['id', 'role'],
    });
    if (!user) {
      throw new NotFoundException(getLanguageValue(language, 'user_not_found'));
    }

    // 2. Only a real CUSTOMER can ask to become a seller
    if (user.role !== UserRole.CUSTOMER) {
      throw new BadRequestException(
        getLanguageValue(language, 'only_customers_can_request_seller'),
      );
    }

    // 3. Block a second request while one is still waiting
    const pendingRequest = await this.sellerRequestsModel.findOne({
      where: { userId, status: SellerRequestStatus.PENDING },
    });
    if (pendingRequest) {
      throw new BadRequestException(
        getLanguageValue(language, 'seller_request_already_pending'),
      );
    }

    // 4. Create the request (status defaults to PENDING)
    return this.sellerRequestsModel.create({
      userId,
      reason: reason ?? null,
    });
  }
}