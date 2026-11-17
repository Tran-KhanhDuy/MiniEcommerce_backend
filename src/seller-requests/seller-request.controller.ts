import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/guards/roles.decorator';
import { CreateSellerRequestDto } from './seller-requests.dto';
import { SellerRequestsService } from './seller-requests.service';

@ApiTags('Seller Requests')
@Controller('seller-requests')
export class SellerRequestsController {
  constructor(private readonly sellerRequestsService: SellerRequestsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  create(
    @Body() createSellerRequestDto: CreateSellerRequestDto,
    @Req() req: any,
    @Headers('language') language = 'en',
  ) {
    return this.sellerRequestsService.createRequest(
      createSellerRequestDto,
      req.user.id,
      language,
    );
  }
}
