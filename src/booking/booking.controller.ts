import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UnauthorizedException, HttpStatus, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { City } from '@prisma/client';
import { TicketResponse } from 'src/types/booking.interface';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/all-tickets')
  async findAllTickets(
    @Query("departureCity") departureCity?: City,
    @Query("arrivalCity") arrivalCity?: City,
    @Query("departureDate") departureDate?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ): Promise<TicketResponse[]> {

    if (departureCity && !this.IsValidCity(departureCity)) {
      throw new BadRequestException({
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Please select a valid departure city'],
      });
    }

    if (arrivalCity && !this.IsValidCity(arrivalCity)) {
      throw new BadRequestException({
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Please select a valid arrival city'],
      });
    }

    if (departureDate && !this.IsValidDate(departureDate)) {
      throw new BadRequestException({
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Please choose a valid departure date'],
      });
    }

    const date = departureDate ? {
      
    } : undefined

    const filter = {
      ...(departureCity && { departureCity }),
      ...(arrivalCity && { arrivalCity }),
      ...(departureDate && { departureDate })
    }

    const take = limit ? Math.max(1, limit) : 2;
    const skip = page ? Math.max(0, page - 1) * take : 0;
    

    return await this.bookingService.findAllTickets(filter, take, skip);
  }

  private IsValidDate (dateString: string){
    const date = new Date(dateString);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  private IsValidCity (city: City){
    return Object.values(City).includes(city);
  }
}
