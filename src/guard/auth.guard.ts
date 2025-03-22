import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { TokenPayload } from 'src/interface/auth.interface';

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
      const TokenPayload = await this.validateToken(accessToken);
      const authenticatedUser = await this.validateUser(TokenPayload);

      return this.hasRequiredRole(requiredRoles, authenticatedUser.role);
    } catch (error) {
      this.handleError(error);
    }
  }

  private hasRequiredRole(requiredRoles: Role[], userRole: Role): boolean {
    const hasPermission = requiredRoles.includes(userRole);
    if (!hasPermission) {
      throw new ForbiddenException({
        error: 'Forbidden',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['You do not have permission to access this resource'],
      });
    }
    return true;
  }

  private async validateUser(payload: TokenPayload) {
    const user = await this.database.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException({
        error: 'Not Found',
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['User does not exist'],
      });
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
    const accessToken = request.cookies['access-token'];
    if (!accessToken) {
      throw new UnauthorizedException('Authentication token is missing');
    }
    return accessToken;
  }

  private handleError(error: Error): never {
    if (
      error instanceof UnauthorizedException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }
    throw new UnauthorizedException('Authentication failed');
  }
}
