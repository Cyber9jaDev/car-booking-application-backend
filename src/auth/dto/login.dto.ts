import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email must be a valid email address',
    type: String,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Password must contain an upper case, lower case, number and special character. \n It must have minimum Length of 8 characters',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
