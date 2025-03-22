"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
const database_service_1 = require("../database/database.service");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    database;
    jwtService;
    constructor(database, jwtService) {
        this.database = database;
        this.jwtService = jwtService;
    }
    createCookie(token) {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        };
        return {
            name: 'access-token',
            value: token,
            options: cookieOptions,
        };
    }
    handleError(error) {
        if (error instanceof common_1.UnauthorizedException ||
            error instanceof common_1.BadRequestException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException({
            error: "Internal Server Error",
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: ['Internal Server Error'],
        });
    }
    async signup(signupDto, response) {
        if (!signupDto.hasAgreedTermsAndConditions) {
            throw new common_1.BadRequestException({
                error: "Bad Request",
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: ['Please agree to the terms and conditions'],
            });
        }
        try {
            const existingUser = await this.database.user.findUnique({
                where: { email: signupDto.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException({
                    error: "Bad Request",
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: ['Email already exists'],
                });
            }
            const existingPhoneNumber = await this.database.user.findUnique({
                where: { phoneNumber: signupDto.phoneNumber },
            });
            if (existingPhoneNumber) {
                throw new common_1.BadRequestException({
                    error: "Bad Request",
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
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
            if (!newUser) {
                throw new common_1.UnauthorizedException({
                    error: "Unauthorized",
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: ['Failed to create ticket'],
                });
            }
            const payload = { userId: newUser.id };
            const token = await this.jwtService.signAsync(payload);
            const cookie = this.createCookie(token);
            response.cookie(cookie.name, cookie.value, cookie.options);
            return { message: 'User created successfully', error: false, statusCode: common_1.HttpStatus.CREATED };
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async login(loginDto, response) {
        try {
            const user = await this.database.user.findUnique({
                where: { email: loginDto.email },
                select: { id: true, password: true, email: true, role: true },
            });
            if (!user) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
            if (!isValidPassword) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            const payload = { userId: user.id };
            const token = await this.jwtService.signAsync(payload);
            const cookie = this.createCookie(token);
            response.cookie(cookie.name, cookie.value, cookie.options);
            return { message: 'Login successful', error: false, statusCode: common_1.HttpStatus.OK };
        }
        catch (error) {
            throw new Error(`Failed to login: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "signup", null);
__decorate([
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map