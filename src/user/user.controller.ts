import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterceptor } from 'src/interceptor/user.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseInterceptors(UserInterceptor)
  getAuthUser() {
    return this.userService.getAuthUser()
  }
}
