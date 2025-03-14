import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JWTPayload } from 'src/auth/types/auth.types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly database: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // "roles" is coming from the Roles decorator metadata
    const requiredRoles: Role[] = await this.reflector.getAllAndOverride(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // If no role is provided
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      })) as JWTPayload;

      const user = await this.database.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      // We're assigning the payload to the request object here so that we can access it in our route handlers
      request.user = payload;

      return requiredRoles.includes(user.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
