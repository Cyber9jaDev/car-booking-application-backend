import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Res, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginResponse, SignupResponse } from 'src/interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly JWT_EXPIRATION = '24h';

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
      const existingUser = await this.database.user.findUnique({ where: { email: signupDto.email } });

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
        select: { id: true, role: true },
      });

      if(!newUser){
        throw new UnauthorizedException({
          error: "Unauthorized",
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Failed to create user'],
        });
      }

      // Create JSON payload
      const payload = { userId: newUser.id, role: newUser.role };    
      const token = await this.jwtService.signAsync(payload, { expiresIn: this.JWT_EXPIRATION });
      response.cookie("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24h in milliseconds
        path: "/",
      });

      return { success: true, statusCode: HttpStatus.CREATED, data: { userId: newUser.id, role: newUser.role }}
      
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
        throw new UnauthorizedException({
          error: "Unauthorized",
          statusCode: HttpStatus.UNAUTHORIZED,
          message: ['Invalid credentials'],
        });
      }

      const isValidPassword = await bcrypt.compare( loginDto.password,user.password );

      if (!isValidPassword) {
        throw new UnauthorizedException({
          error: "Unauthorized",
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Invalid credentials'],
        });
      }

      // JWT Payload
      const payload = { userId: user.id, role: user.role };
      const token = await this.jwtService.signAsync(payload, { expiresIn: this.JWT_EXPIRATION });
      response.cookie("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24h in milliseconds
        path: "/",
      });

      return { success: true, statusCode: HttpStatus.OK, data: { userId: user.id, role: user.role } };

    } catch (error) {
      this.handleError(error)
    }
  }
}
