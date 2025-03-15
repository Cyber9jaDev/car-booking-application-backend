import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/types/auth.types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async getAuthUser(@Req() request: Request) {
    const user = (request as any).user as TokenPayload;

    if (!user || !user.userId) {
      throw new NotFoundException('User not authenticated');
    }

    try {
      const { userId } = user;
      return await this.database.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }
}
