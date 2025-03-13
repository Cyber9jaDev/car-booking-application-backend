import { LoginResponse, SignupResponse } from './types/auth.types';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class AuthService {
    private readonly database;
    constructor(database: DatabaseService);
    private generateJWT;
    signup(signupDto: SignupDto): Promise<SignupResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
}
