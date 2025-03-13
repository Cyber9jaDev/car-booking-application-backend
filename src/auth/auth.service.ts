import { LoginResponse, SignupResponse } from './types/auth.types';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  private generateJWT(userId: string) {
    const secretOrPrivateKey = process.env.JWT_KEY as jwt.Secret;
    if (!secretOrPrivateKey) {
      throw new Error('JWT_KEY is not defined');
    }
    return jwt.sign({ userId }, secretOrPrivateKey, { expiresIn: '1d' });
  }

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
          phone: signupDto.phone,
          role: signupDto.role,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });

      return { token: this.generateJWT(newUser.id) };
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
      return { token: this.generateJWT(user.id) };
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
