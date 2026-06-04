import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateOrderDto, QueryOrderDto } from './orders.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('language') language = 'en',
  ) {
    return this.ordersService.createOrder(createOrderDto, language);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: QueryOrderDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('language') language = 'en',
  ) {
    return this.ordersService.findOne(id, language);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Headers('language') language = 'en',
  ) {
    return this.ordersService.cancelOrder(id, language);
  }
  @Patch(':id/pay')
   @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  payOrder(
    @Param('id', ParseIntPipe) id: number,
    @Headers('language') language = 'en',
  ) {
    return this.ordersService.payOrder(id, language);
  }
}
