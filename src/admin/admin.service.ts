import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DatabaseService } from 'src/database/database.service';
import { VehicleType } from '@prisma/client';
import { VehicleSeats } from 'src/interface/admin.interface';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: string) {
    if (createTicketDto.departureCity === createTicketDto.arrivalCity) {
      throw new BadRequestException({
        error: 'Bad Request',
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
              id: userId,
            },
          },
        },
      });

      if (!createTicket) {
        throw new UnauthorizedException({
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
          message: ['Unable to create ticket'],
        });
      }
      
      return {
        message: 'Ticket Created Successfully',
        error: false,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: Error): never {
    if (
      error instanceof UnauthorizedException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    throw new InternalServerErrorException({
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal Server Error'],
    });
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
