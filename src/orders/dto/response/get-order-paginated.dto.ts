import { GetOrderResponseDto } from './get-order-response.dto';

export interface GetOrderPaginatedDto {
  total: number;
  data: GetOrderResponseDto[];
}
