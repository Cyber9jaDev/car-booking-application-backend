import { IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
  // @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: 'seller1@gmail.com', required: true })
  @IsEmail()
  email: string;
  email: string 

  
}