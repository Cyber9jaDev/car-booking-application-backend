import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminService {
  constructor( private readonly db: DatabaseService ){}

  async createTicket(createTicketDto: CreateTicketDto) {
    
    // Implement the logic to create a ticket
    // This is a placeholder and should be replaced with actual implementation
    console.log(createTicketDto);
    // const createdTicket = this.db.ticket.  
    // return 'This action adds a new ticket';
  }




}
