import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, SignupResponse } from './types/auth.types';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto, response: Response): Promise<SignupResponse>;
    login(loginDto: LoginDto, response: Response): Promise<LoginResponse>;
}
