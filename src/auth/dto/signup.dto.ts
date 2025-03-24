import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ type: String, example: 'Babatunde Gbadebo', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, example: 'seller1@gmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password must contain an upper case, lower case, number and special character. \n It must have minimum Length of 5 characters',
    type: String,
    example: 'Test@123456',
    required: true,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Enter a valid phone number',
    type: String,
    example: '1000000001',
    required: true,
  })
  @Matches(/^0\d{10}$/, {
    message: 'Phone number must be 11 digits and start with 0',
  })
  phoneNumber: string;

  @ApiProperty({
    enum: Role,
    example: Role.PASSENGER,
    required: true,
    enumName: Role.PASSENGER,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role = Role.PASSENGER;

  @ApiProperty({ type: Boolean, example: true, required: true, default: false })
  @IsBoolean()
  @IsNotEmpty()
  hasAgreedTermsAndConditions: boolean = false;
}
