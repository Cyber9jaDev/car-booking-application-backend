import { BadRequestException, HttpStatus, Injectable, Res } from '@nestjs/common';
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

  async signup(signupDto: SignupDto, @Res({ passthrough: true }) response: Response): Promise<SignupResponse> {
    
    if(!signupDto.hasAgreedTermsAndConditions){
      throw new BadRequestException('Please agree to the terms and conditions')
    }
    try {
      const existingUser = await this.database.user.findUnique({
        where: { email: signupDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
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

      const payload = { userId: newUser.id, email: newUser.email };
      const token = await this.jwtService.signAsync(payload);
      const cookie = this.createCookie(token);
      response.cookie(cookie.name, cookie.value, cookie.options);

      return { message: 'User created successfully', success: true, statusCode: HttpStatus.OK }
      
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
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

      const payload = { userId: user.id, email: user.email, role: user.role };
      const token = await this.jwtService.signAsync(payload);
      const cookie = this.createCookie(token);
      console.log(cookie);
      response.cookie(cookie.name, cookie.value, cookie.options);
      return { message: 'Login successful', success: true, statusCode: HttpStatus.OK };

    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
