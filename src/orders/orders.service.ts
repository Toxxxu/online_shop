import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrdersRepository } from './orders.repository';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { CreateOrderRequestDto } from './dto/request/create-order-request.dto';
import { GetOrderResponseDto } from './dto/response/get-order-response.dto';
import { Order } from './entities/order.entity';
import { GetProductResponseDto } from 'src/products/dto/response/get-product-response.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';
import { GetOrderPaginatedDto } from './dto/response/get-order-paginated.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async createOrder(
    createOrderRequest: CreateOrderRequestDto,
  ): Promise<GetOrderResponseDto> {
    const user = await this.usersService.validateUser(
      createOrderRequest.userId,
      createOrderRequest.password,
    );
    const product = await this.productsService.getProductById(
      createOrderRequest.productId,
    );
    await this.validateCreateOrder(user.id, product.user.id);
    const order = await this.ordersRepository.create(
      createOrderRequest,
      product,
      user,
    );
    return this.buildResponse(order, product, user);
  }

  private async validateCreateOrder(
    userIdClient: string,
    userIdOwner: string,
  ): Promise<void> {
    if (userIdClient === userIdOwner) {
      throw new BadRequestException(
        `The user with the same id can't order items, userId: '${userIdClient}'`,
      );
    }
  }

  async getOrderById(orderId: string): Promise<GetOrderResponseDto> {
    const order = await this.ordersRepository.findOneById(orderId);
    if (!order) {
      throw new NotFoundException(`Order not found by id: '${orderId}'.`);
    }
    const productId = order.product.id;
    const userId = order.user.id;
    const product = await this.productsService.getProductById(productId);
    const user = await this.usersService.getUserById(userId);
    return this.buildResponse(order, product, user);
  }

  async getAllorders(
    page: number,
    limit: number,
  ): Promise<GetOrderPaginatedDto> {
    const skip = (page - 1) * limit;
    const [orders, total] = await this.ordersRepository.findAll(skip, limit);
    const data = await Promise.all(
      orders.map(async (order) => {
        const productId = order.product.id;
        const userId = order.user.id;
        const product = await this.productsService.getProductById(productId);
        const user = await this.usersService.getUserById(userId);
        return this.buildResponse(order, product, user);
      }),
    );
    return this.buildPaginationResponse(total, data);
  }

  private buildResponse(
    order: Order,
    product: GetProductResponseDto,
    user: GetUserResponseDto,
  ): GetOrderResponseDto {
    return {
      id: order.id.toString(),
      product,
      user,
      quantity: order.quantity,
    };
  }

  private buildPaginationResponse(
    total: number,
    data: GetOrderResponseDto[],
  ): GetOrderPaginatedDto {
    return {
      total,
      data,
    };
  }
}
