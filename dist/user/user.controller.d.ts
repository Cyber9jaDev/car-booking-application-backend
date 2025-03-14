import { UserService } from './user.service';
import { JWTPayload } from 'src/auth/types/auth.types';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAuthUser(request: JWTPayload): Promise<JWTPayload>;
}
