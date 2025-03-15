import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies['access-token'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = this.jwtService.decode(token);
      console.log("Interceptor", user);
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    return next.handle();
  }
}
