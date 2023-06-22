import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt.-auth.guard";
import { CurrentUser } from "./auth/current-user.decorator";
import { User } from "./users/user.entity";


@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}