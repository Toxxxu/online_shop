import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CreateOrderRequestDto } from './dto/request/create-order-request.dto';
import { GetProductResponseDto } from 'src/products/dto/response/get-product-response.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(
    order: CreateOrderRequestDto,
    product: GetProductResponseDto,
    user: GetUserResponseDto,
  ): Promise<Order> {
    return await this.ordersRepository.save({ ...order, product, user });
  }

  async findOneById(id: string): Promise<Order> {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.id = :id', { id })
      .getOne();
  }

  async findAll(skip: number, take: number): Promise<[Order[], total: number]> {
    return await this.ordersRepository.findAndCount({
      skip,
      take,
      relations: ['product', 'user'],
    });
  }
}
