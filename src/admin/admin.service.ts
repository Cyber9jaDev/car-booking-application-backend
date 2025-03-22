import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DatabaseService } from 'src/database/database.service';
import { VehicleType } from '@prisma/client';
import { VehicleSeats } from 'src/interface/admin.interface';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async createTicket(createTicketDto: CreateTicketDto) {

    if(createTicketDto.departureCity === createTicketDto.arrivalCity){
      throw new BadRequestException({
        error: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Departure city cannot be the same as the arrival city'],
      });
    }

    try {
      const createTicket = this.db.ticket.create({
        data: {
          departureCity: createTicketDto.departureCity,
          arrivalCity: createTicketDto.arrivalCity,
          departureDate: createTicketDto.departureDate,
          ticketFee: createTicketDto.ticketFee,
          availableSeats: this.createSeatNumbers(createTicketDto.vehicleType),
          vehicleType: createTicketDto.vehicleType,
          createdBy: {
            connect: {
              id: 'f10ad476-ef58-42e0-b48f-f9957b5bfeca',
            },
          },
        },
      });

      if (!createTicket) {
        throw new BadRequestException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Unable to create ticket'],
        });
      }

      return createTicket;
    } catch (error) {
      throw error;
    }
  }

  private createSeatNumbers(vehicleType: VehicleType) {
    const vehicleSeat = VehicleSeats[vehicleType];
    const seatNumbers: number[] = [];
    for (let i = 1; i <= vehicleSeat; i++) {
      seatNumbers.push(i);
    }
    return seatNumbers;
  }
}
