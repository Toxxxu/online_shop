import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductRequestDto } from './dto/request/create-product-request.dto';
import { GetProductResponseDto } from './dto/response/get-product-response.dto';
import { GetProductPaginatedDto } from './dto/response/get-product-paginated.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() createProductRequest: CreateProductRequestDto,
  ): Promise<GetProductResponseDto> {
    return await this.productsService.createProduct(createProductRequest);
  }

  @Get()
  async findAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<GetProductPaginatedDto> {
    return await this.productsService.getAllProducts(page, limit);
  }

  @Get(':id')
  async findProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetProductResponseDto> {
    return await this.productsService.getProductById(id);
  }
}
