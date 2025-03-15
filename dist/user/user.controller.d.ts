import { Request, Response } from 'express';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    setCookie(response: Response): {};
    getCookie(request: Request): any;
    getAuthUser(request: Request): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
}
