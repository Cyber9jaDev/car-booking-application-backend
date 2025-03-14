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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
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
    async signup(signupDto) {
        try {
            const existingUser = await this.database.user.findFirst({
                where: { email: signupDto.email },
            });
            if (existingUser) {
                throw new Error('User already exists');
            }
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
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    async login(loginDto) {
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
                throw new common_1.BadRequestException('Invalid credentials');
            }
            const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
            if (!isValidPassword) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            const payload = { userId: user.id, email: user.email };
            return { "access-token": await this.jwtService.signAsync(payload) };
        }
        catch (error) {
            throw new Error(`Failed to login: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map