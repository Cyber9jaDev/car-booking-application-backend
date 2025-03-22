import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, Res, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { LoginResponse, SignupResponse } from 'src/interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private createCookie(token: string){
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }

    return {
      name: 'access-token',
      value: token,
      options: cookieOptions,
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
        error: "Internal Server Error",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Internal Server Error'],
      });
    }

  async signup(signupDto: SignupDto, @Res({ passthrough: true }) response: Response): Promise<SignupResponse> {
    
    if(!signupDto.hasAgreedTermsAndConditions){
      throw new BadRequestException({
        error: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Please agree to the terms and conditions'],
      });
    }

    try {
      const existingUser = await this.database.user.findUnique({
        where: { email: signupDto.email },
      });

      if (existingUser) {
        throw new BadRequestException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Email already exists'],
        });
      }

      const existingPhoneNumber = await this.database.user.findUnique({
        where: { phoneNumber: signupDto.phoneNumber },
      });

      if (existingPhoneNumber) {
        throw new BadRequestException({
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Phone number is in use by another user'],
        });
      }

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      const newUser = await this.database.user.create({
        data: {
          email: signupDto.email,
          name: signupDto.name,
          phoneNumber: signupDto.phoneNumber,
          role: signupDto.role,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });

      if(!newUser){
        throw new UnauthorizedException({
          error: "Unauthorized",
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Failed to create ticket'],
        });
      }

      // JWT Payload - attach only userId to jwt payload
      const payload = { userId: newUser.id };    
      const token = await this.jwtService.signAsync(payload);
      const cookie = this.createCookie(token);
      response.cookie(cookie.name, cookie.value, cookie.options);

      return { message: 'User created successfully', error: false, statusCode: HttpStatus.CREATED}
      
    } catch (error) {
      this.handleError(error)
    }
  }

  async login(loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<LoginResponse> {
    try {
      const user = await this.database.user.findUnique({
        where: { email: loginDto.email },
        select: { id: true, password: true, email: true, role: true },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new BadRequestException('Invalid credentials');
      }

      // JWT Payload
      const payload = { userId: user.id };
      const token = await this.jwtService.signAsync(payload);
      const cookie = this.createCookie(token);
      response.cookie(cookie.name, cookie.value, cookie.options);
      return { message: 'Login successful', error: false, statusCode: HttpStatus.OK };

    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
