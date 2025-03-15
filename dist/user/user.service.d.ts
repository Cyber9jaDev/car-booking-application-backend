import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
export declare class UserService {
    private readonly database;
    constructor(database: DatabaseService);
    getAuthUser(request: Request): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
}
