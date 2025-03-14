import { LoginResponse, SignupResponse } from './types/auth.types';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly database;
    private readonly jwtService;
    constructor(database: DatabaseService, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<SignupResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
}
