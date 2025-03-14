import { JWTPayload } from 'src/auth/types/auth.types';
export declare class UserService {
    getAuthUser(request: JWTPayload): Promise<JWTPayload>;
}
