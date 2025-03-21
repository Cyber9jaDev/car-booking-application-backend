import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { LoginResponse, SignupResponse } from 'src/interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup( @Body() signupDto: SignupDto, @Res({ passthrough: true }) response: Response,): Promise<SignupResponse> {
    return this.authService.signup(signupDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login( @Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response, ): Promise<LoginResponse> {
    return this.authService.login(loginDto, response);
  }
}
