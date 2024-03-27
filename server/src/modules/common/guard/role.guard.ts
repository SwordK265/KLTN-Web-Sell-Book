import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constant';
import { ForbiddenSourceException } from '../exceptions';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const catchRoles = this.reflector.getAllAndOverride<Role[]>('role', [
            context.getHandler(),
            context.getClass()
        ]);

        if (!catchRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const validRole = catchRoles.some((role) =>
            request.user.roles?.includes(role)
        );

        if (!validRole) {
            throw new ForbiddenSourceException();
        }

        return validRole;
    }
}
