import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { TokenPayload } from 'src/auth/types/auth.types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly database: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.getRequiredRoles(context); // "roles" is coming from the Roles decorator metadata

      // If no roles are required, allow access (Public route);
      if (this.isPublicRoute(requiredRoles)) {
        return true;
      }
      const request = this.getRequest(context);
      const accessToken = this.extractTokenFromCookie(request);

      // if (!accessToken) {
      //   throw new UnauthorizedException('No token provided');
      // }
      const TokenPayload = await this.validateToken(accessToken);
      const authenticateduser = await this.validateUser(TokenPayload);
      // Attach user to request for use in controllers
      request.user = TokenPayload;

      return this.hasRequiredRole(requiredRoles, authenticateduser.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private hasRequiredRole(requiredRoles: Role[], userRole: Role): boolean {
    const hasPermission = requiredRoles.includes(userRole);
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }

  private async validateUser(payload: TokenPayload) {
    const user = await this.database.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }

  private async validateToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private isPublicRoute(requiredRoles: Role[]): boolean {
    return !requiredRoles || requiredRoles.length === 0;
  }

  private getRequiredRoles(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }

  private extractTokenFromCookie(request: Request) {
    const token = request.cookies['access-token'];
    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }
    return token;
  }
}
