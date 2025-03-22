import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginResponse, SignupResponse } from 'src/interface/auth.interface';
export declare class AuthService {
    private readonly database;
    private readonly jwtService;
    constructor(database: DatabaseService, jwtService: JwtService);
    private createCookie;
    private handleError;
    signup(signupDto: SignupDto, response: Response): Promise<SignupResponse>;
    login(loginDto: LoginDto, response: Response): Promise<LoginResponse>;
}
