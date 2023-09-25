import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductRequestDto } from './dto/request/create-product-request.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(
    product: CreateProductRequestDto,
    user: GetUserResponseDto,
  ): Promise<Product> {
    return await this.productsRepository.save({ ...product, user });
  }

  async findOneById(id: string): Promise<Product> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where('product.id = :id', { id })
      .getOne();
  }

  async findAll(
    skip: number,
    take: number,
  ): Promise<[Product[], total: number]> {
    return await this.productsRepository.findAndCount({
      skip,
      take,
      relations: ['user'],
    });
  }
}
