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
    return this.usersRepository.save(user);
  }

  findOneById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  findAll(skip: number, take: number): Promise<[User[], total: number]> {
    return this.usersRepository.findAndCount({ skip, take });
  }
}
