import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);

    if (!user) {
      throw new UnauthorizedException({ message: `User with username '${username}' not found...` });
    }

    const passwordEquals = await bcrypt.compare(password, user.password);

    if (!passwordEquals) {
      throw new UnauthorizedException({ message: "Incorrect password..." });
    }

    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async registration(user: CreateUserDto) {
    const candidate = await this.usersService.findOneByName(user.username);

    if (candidate) {
      throw new HttpException("User already exist", HttpStatus.BAD_REQUEST);
    }

    await this.usersService.createUser(user);

    return "registration successfully";
  }
}