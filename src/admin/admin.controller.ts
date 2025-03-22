import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UserInterceptor } from 'src/interceptor/user.interceptor';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from '@prisma/client';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @UseInterceptors(UserInterceptor)
  @Post('/create-ticket')
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.adminService.createTicket(createTicketDto);
  }
}
