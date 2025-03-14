import { Role } from "@prisma/client";

interface BaseAuthResponse {
  // id: string,
  // email: string,
  // name: string;
  // phone: string;
  // role: Role;
  "access-token": string;
}

export interface SignupResponse extends BaseAuthResponse {}
export interface LoginResponse extends BaseAuthResponse {}