import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Create Roles accessible in the guard decorator by setting a metadata named "roles"
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
