import { Controller, Get, Request, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterceptor } from 'src/interceptor/user.interceptor';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { JWTPayload } from 'src/auth/types/auth.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @Roles(Role.PASSENGER, Role.ADMIN)
  @UseInterceptors(UserInterceptor)
  getAuthUser(@Request() request: JWTPayload) {
    return this.userService.getAuthUser(request);
  }
}
