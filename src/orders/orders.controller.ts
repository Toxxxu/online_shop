import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/request/create-order-request.dto';
import { GetOrderResponseDto } from './dto/response/get-order-response.dto';
import { GetOrderPaginatedDto } from './dto/response/get-order-paginated.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() createOrderRequest: CreateOrderRequestDto,
  ): Promise<GetOrderResponseDto> {
    return await this.ordersService.createOrder(createOrderRequest);
  }

  @Get()
  async findAllOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<GetOrderPaginatedDto> {
    return await this.ordersService.getAllorders(page, limit);
  }

  @Get(':id')
  async findOrderById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetOrderResponseDto> {
    return await this.ordersService.getOrderById(id);
  }
}
