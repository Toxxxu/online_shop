import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { User } from './entities/user.entity';
import { GetUserPaginatedDto } from './dto/response/get-user-paginated.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(
    createUserRequest: CreateUserRequestDto,
  ): Promise<GetUserResponseDto> {
    await this.validateCreateUserRequest(createUserRequest);
    const user = await this.usersRepository.create(createUserRequest);
    return this.buildResponse(user);
  }

  private async validateCreateUserRequest(
    createUserRequest: CreateUserRequestDto,
  ): Promise<void> {
    const user = await this.usersRepository.findOneByEmail(
      createUserRequest.email,
    );
    if (user) {
      throw new BadRequestException('This email already exists.');
    }
  }

  async getUserById(userId: string): Promise<GetUserResponseDto> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User not found by id: '${userId}'.`);
    }
    return this.buildResponse(user);
  }

  async getAllUsers(page: number, limit: number): Promise<GetUserPaginatedDto> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepository.findAll(skip, limit);
    const data = users.map((user) => this.buildResponse(user));
    return this.buildPaginationResponse(total, data);
  }

  private buildResponse(user: User): GetUserResponseDto {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  private buildPaginationResponse(total: number, data: GetUserResponseDto[]) {
    return {
      total,
      data,
    };
  }
}
