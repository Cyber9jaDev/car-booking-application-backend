import { Role } from "@prisma/client";

interface BaseAuthResponse {
  // message: string;
  success: boolean;
  statusCode: number;
  data: {
    userId: string;
    role: Role
  }
}

export interface TokenPayload {
  userId: string;
  email: string;
  role?: Role
  iat?: number;
  exp?: number;
}

export interface SignupResponse extends BaseAuthResponse {}
export interface LoginResponse extends BaseAuthResponse {}
