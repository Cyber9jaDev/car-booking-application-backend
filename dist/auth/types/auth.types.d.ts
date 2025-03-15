import { Role } from "@prisma/client";
interface BaseAuthResponse {
    message: string;
    success: boolean;
}
export interface TokenPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
    role: Role;
}
export interface SignupResponse extends BaseAuthResponse {
}
export interface LoginResponse extends BaseAuthResponse {
}
export {};
