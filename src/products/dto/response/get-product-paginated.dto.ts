import { GetProductResponseDto } from './get-product-response.dto';

export interface GetProductPaginatedDto {
  total: number;
  data: GetProductResponseDto[];
}
