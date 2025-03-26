import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UserInterceptor } from 'src/interceptor/user.interceptor';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { User } from 'src/decorator/user.decorator';
import { JwtPayload } from 'jsonwebtoken';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @UseInterceptors(UserInterceptor)
  @Post('/create-ticket')
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @User() user: JwtPayload
  ) {

    console.log(createTicketDto);
    // We can also use the request object to get the user
    return this.adminService.createTicket(createTicketDto, user.userId);
  }
}
