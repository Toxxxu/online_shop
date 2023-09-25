import { GetUserResponseDto } from './get-user-response.dto';

export interface GetUserPaginatedDto {
  total: number;
  data: GetUserResponseDto[];
}
