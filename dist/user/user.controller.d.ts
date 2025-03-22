import { Request } from 'express';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAuthUser(request: Request): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
