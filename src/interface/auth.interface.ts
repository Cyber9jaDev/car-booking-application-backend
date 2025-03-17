import { Role } from "@prisma/client";

interface BaseAuthResponse {
  message: string;
  success: boolean;
  statusCode: number;
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

export interface BaseErrorResponse{
  message: string;
  statusCode: number;
  success: boolean;
}