import { Controller, Get, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserInterceptor } from 'src/interceptor/user.interceptor';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/set-cookie')
  setCookie(@Res() response: Response) {
    const cookie = response.cookie('session', '123456', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    console.log(cookie);
    return {};
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request) {
    const cookie = request.cookies['session'];
    console.log(cookie);
    return cookie;
  }

  @Get('/me')
  @Roles(Role.PASSENGER)
  @UseInterceptors(UserInterceptor)
  getAuthUser(@Req() request: Request) {
    return this.userService.getAuthUser(request);
  }
}
