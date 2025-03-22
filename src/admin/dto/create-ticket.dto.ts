import { ApiProperty } from '@nestjs/swagger';
import { City, VehicleType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    enum: City,
    example: City.aba,
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
    example: City.agege,
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
    enum: VehicleType,
    example: VehicleType.minibus,
    required: true,
    description: 'Type of bus for the trip',
  })
  @IsNotEmpty({ message: 'Bus type is required' })
  @IsEnum(VehicleType, {
    message: 'Invalid bus type. Please select from the available options.',
  })
  vehicleType: VehicleType;

  @ApiProperty({
    type: 'array',
    description: 'Number of available seats per vehicle type',
    examples: [
      { vehicleType: VehicleType.sienna, seats: 7 },
      { vehicleType: VehicleType.minibus, seats: 12 },
      { vehicleType: VehicleType.toyota, seats: 14 },
    ],
    minimum: 1,
    maximum: 14,
  })
  @IsNotEmpty({ message: 'Available seats configuration is required' })
  @IsArray()
  @IsNumber({}, { each: true, message: 'Seat count must be a number' })
  @ArrayNotEmpty({
    message: 'At least one seat configuration must be provided',
  })
  @ArrayMinSize(1, { message: 'Vehicle must have at least 1 seat' })
  @ArrayMaxSize(14, { message: 'Vehicle cannot have more than 14 seats' })
  @Min(1, { each: true, message: 'Each vehicle must have at least 1 seat' })
  @Max(14, { each: true, message: 'Each vehicle cannot exceed 14 seats' })
  availableSeats: number[];
}
