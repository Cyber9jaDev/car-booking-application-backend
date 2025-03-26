import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BookingService {

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}


  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  async findAll() {
    const tickets = await this.db.ticket.findMany({})
    return tickets;
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
}
