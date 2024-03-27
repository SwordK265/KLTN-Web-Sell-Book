import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { ApiConfigService } from '../../../shared/services/shared.service';
import {
    AuthenticationFailedException,
    InvalidTokenException,
    UserNotFoundException
} from '../exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private userService: UserService,
        private configService: ApiConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new InvalidTokenException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.authConfig.jwtSecret
            });
            const user = await this.userService.findById(payload.id);

            if (!user) {
                throw new UserNotFoundException();
            }

            request.user = user;
        } catch {
            throw new AuthenticationFailedException();
        }

        return true;
    }

    private extractTokenFromHeader(req: Request): string | undefined {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            return req.headers.authorization.split(' ')[1];
        }

        return undefined;
    }
}
