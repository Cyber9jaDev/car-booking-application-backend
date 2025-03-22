import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { LoginResponse, SignupResponse } from 'src/interface/auth.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto, response: Response): Promise<SignupResponse>;
    login(loginDto: LoginDto, response: Response): Promise<LoginResponse>;
}
