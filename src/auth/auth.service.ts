import { LoginResponse, SignupResponse } from './types/auth.types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SignupResponse> {
    try {
      const existingUser = await this.database.user.findFirst({
        where: { email: signupDto.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      const newUser = await this.database.user.create({
        data: {
          email: signupDto.email,
          name: signupDto.name,
          phone_number: signupDto.phone_number,
          role: signupDto.role,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });

      const payload = { userId: newUser.id, email: newUser.email };
      return { "access-token": await this.jwtService.signAsync(payload) };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.database.user.findUnique({
        where: {
          email: loginDto.email,
        },
        select: {
          id: true,
          password: true,
          email: true,
        },
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

      const payload = { userId: user.id, email: user.email };
      return { "access-token": await this.jwtService.signAsync(payload) };
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
