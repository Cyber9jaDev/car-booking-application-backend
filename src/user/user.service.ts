import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { TokenPayload } from 'src/auth/types/auth.types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}
  async getAuthUser(@Request() request) {
    const { userId } = request.user as TokenPayload;
    try {
      return await this.database.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }
}
