import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
  }

  findOneByName(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async createUser(user: CreateUserDto) {
    await this.usersRepository.save({ ...user, password: await bcrypt.hash(user.password, 5) });
  }
}