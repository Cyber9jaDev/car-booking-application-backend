interface BaseAuthResponse {
    "access-token": string;
}
export interface SignupResponse extends BaseAuthResponse {
}
export interface LoginResponse extends BaseAuthResponse {
}
export {};
