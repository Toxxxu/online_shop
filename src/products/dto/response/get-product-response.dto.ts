import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';

export interface GetProductResponseDto {
  id: string;
  name: string;
  price: number;
  user: GetUserResponseDto;
}
