import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  ValidateIf,
} from 'class-validator';
import { Bus, City } from 'src/interface/admin.interface';

export class CreateTicketDto {
  @ApiProperty({
    enum: City,
    example: City.LAGOS,
    required: true,
    description: 'Departure city for the trip',
  })
  @IsNotEmpty({ message: 'Departure city is required' })
  @IsEnum(City, {
    message:
      'Invalid departure city. Please select from the available options.',
  })
  departureCity: City;

  @ApiProperty({
    enum: City,
    example: City.LAGOS,
    required: true,
    description: 'Arrival city for the trip',
  })
  @IsNotEmpty({ message: 'Arrival city is required' })
  @IsEnum(City, {
    message: 'Invalid arrival city. Please select from the available options.',
  })
  arrivalCity: City;

  @ApiProperty({
    type: 'string',
    example: new Date().toISOString().split('T')[0],
    required: true,
    format: 'date',
    description: 'Departure date and time (ISO format)',
  })
  @IsNotEmpty({ message: 'Departure date is required' })
  @ValidateIf(
    (object, value) => {
      if (value) {
        return false;
      }
      const departureDate = new Date(value).toDateString().split('T')[0];
      const now = new Date().toDateString().split('T')[0];
      return departureDate > now;
    },
    { message: 'Departure date must be in the future' },
  )
  departureDate: string;

  @ApiProperty({
    type: 'number',
    example: 1000,
    minimum: 1,
    required: true,
    description: 'Ticket fee of the ticket in the local currency',
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Ticket fee must be a number' },
  )
  @IsPositive({ message: 'Ticket fee must be a positive number' })
  @Min(1, { message: 'Ticket fee must be at least 1' })
  @Type(() => Number) // Automatically converts string inputs to numbers
  ticketFee: number;

  @ApiProperty({
    enum: Bus,
    example: Bus.TOYOTA,
    required: true,
    description: 'Type of bus for the trip',
  })
  @IsNotEmpty({ message: 'Bus type is required' })
  @IsEnum(Bus, {
    message: 'Invalid bus type. Please select from the available options.',
  })
  busType: Bus;
}
