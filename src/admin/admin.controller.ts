import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/create-ticket')
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.adminService.createTicket(createTicketDto);
  }
}
