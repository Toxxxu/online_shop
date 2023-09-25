import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProductsRepository } from './products.repository';
import { CreateProductRequestDto } from './dto/request/create-product-request.dto';
import { GetProductResponseDto } from './dto/response/get-product-response.dto';
import { Product } from './entities/product.entity';
import { UsersService } from 'src/users/users.service';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';
import { GetProductPaginatedDto } from './dto/response/get-product-paginated.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createProduct(
    createProductRequest: CreateProductRequestDto,
  ): Promise<GetProductResponseDto> {
    const user = await this.usersService.validateUser(
      createProductRequest.userId,
      createProductRequest.password,
    );
    await this.validateCreateProductRequest(user);
    const product = await this.productsRepository.create(
      createProductRequest,
      user,
    );
    return this.buildResponse(product, user);
  }

  private async validateCreateProductRequest(
    user: GetUserResponseDto,
  ): Promise<void> {
    if (user.role !== 'vendor') {
      throw new BadRequestException(
        `User with role ${user.role} can't create product, only users with role 'vendor' are available to create products.`,
      );
    }
  }

  async getProductById(productId: string): Promise<GetProductResponseDto> {
    const product = await this.productsRepository.findOneById(productId);
    if (!product) {
      throw new NotFoundException(`Product not found by id: '${productId}'.`);
    }
    const userId = product.user.id;
    const user = await this.usersService.getUserById(userId);
    return this.buildResponse(product, user);
  }

  async getAllProducts(
    page: number,
    limit: number,
  ): Promise<GetProductPaginatedDto> {
    const skip = (page - 1) * limit;
    const [products, total] = await this.productsRepository.findAll(
      skip,
      limit,
    );
    const data = await Promise.all(
      products.map(async (product) => {
        const userId = product.user.id;
        const user = await this.usersService.getUserById(userId);
        return this.buildResponse(product, user);
      }),
    );
    return this.buildPaginationResponse(total, data);
  }

  private buildResponse(
    product: Product,
    user: GetUserResponseDto,
  ): GetProductResponseDto {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      user,
    };
  }

  private buildPaginationResponse(
    total: number,
    data: GetProductResponseDto[],
  ): GetProductPaginatedDto {
    return {
      total,
      data,
    };
  }
}
