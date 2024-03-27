import { SetMetadata } from '@nestjs/common';
import { Role } from '../constant';

export const UseRoles = (...roles: Role[]) => SetMetadata('roles', roles);
