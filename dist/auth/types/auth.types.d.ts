interface BaseAuthResponse {
    "access-token": string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}
export interface SignupResponse extends BaseAuthResponse {
}
export interface LoginResponse extends BaseAuthResponse {
}
export {};
