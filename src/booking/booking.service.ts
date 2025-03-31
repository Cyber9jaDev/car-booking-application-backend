import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { Filter, TicketResponse } from 'src/types/booking.interface';

@Injectable()
export class BookingService {

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}


  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  async findAllTickets(filter: Filter, take: number, skip: number, ): Promise<TicketResponse[]> {

    try {
      const tickets = await this.db.ticket.findMany({ take, skip, where: { ...filter }});

      if(!tickets || tickets.length === 0){
        throw new NotFoundException({
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
          message: ['No tickets found'],
        });
      }
      return tickets;
    } catch (error) {
      return this.handleError(error);
    }
    
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }

  private handleError(error: Error): never {
    if (
      error instanceof UnauthorizedException ||
      error instanceof BadRequestException || 
      error instanceof NotFoundException
    ) {
      throw error;
    }
    throw new InternalServerErrorException({
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal Server Error'],
    });
  }
}
