import { Injectable, Request } from '@nestjs/common';
import { JWTPayload } from 'src/auth/types/auth.types';

@Injectable()
export class UserService {
  async getAuthUser(@Request() request: JWTPayload) {
    return request;
  }
}
