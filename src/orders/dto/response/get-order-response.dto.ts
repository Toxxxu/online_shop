import { GetProductResponseDto } from 'src/products/dto/response/get-product-response.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';

export interface GetOrderResponseDto {
  id: string;
  product: GetProductResponseDto;
  user: GetUserResponseDto;
  quantity: number;
}
