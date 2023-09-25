import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserRequestDto): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findOneById(id: string): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findAll(skip: number, take: number): Promise<[User[], total: number]> {
    return await this.usersRepository.findAndCount({ skip, take });
  }
}
