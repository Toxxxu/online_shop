import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { GetUserPaginatedDto } from './dto/response/get-user-paginated.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserRequest: CreateUserRequestDto,
  ): Promise<GetUserResponseDto> {
    return this.usersService.createUser(createUserRequest);
  }

  @Get()
  async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<GetUserPaginatedDto> {
    return this.usersService.getAllUsers(page, limit);
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetUserResponseDto> {
    return this.usersService.getUserById(id);
  }
}
