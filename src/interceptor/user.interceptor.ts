import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenPayload } from 'src/interface/auth.interface';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const request = this.getRequest(context);
      const accessToken = this.extractTokenFromCookie(request);
      const decodedToken = this.decodeAndValidateToken(accessToken);

      request.user = decodedToken;

      return next.handle();
    } catch (error) {
      this.handleError(error);
    }
  }

  private decodeAndValidateToken(accessToken: string): TokenPayload {
    try {
      const decodedToken = this.jwtService.decode(accessToken) as TokenPayload;
      if (!decodedToken || !decodedToken.userId) {
        throw new UnauthorizedException({
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
          message: ['Invalid token payload'],
        });
      }
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Failed to decode token'],
      });
    }
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }

  private handleError(error: Error): never {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException({
      error: 'Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
      message: ['Authentication failed'],
    });
  }

  private extractTokenFromCookie(request: Request) {
    const accessToken = request.cookies['access-token'];
    if (!accessToken) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Authentication token is missing'],
      });
    }
    return accessToken;
  }
}
