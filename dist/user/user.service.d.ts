import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
export declare class UserService {
    private readonly database;
    constructor(database: DatabaseService);
    getAuthUser(request: Request): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
