/* eslint-disable @typescript-eslint/no-inferrable-types */
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
    constructor(
        message: string = 'The access token is invalid',
        description: string = 'invalid_token'
    ) {
        super(message, description);
    }
}

export class LoginFailedException extends UnauthorizedException {
    constructor(
        message: string = 'Email or password are incorrect',
        description: string = 'login_failed'
    ) {
        super(message, description);
    }
}

export class AuthenticationFailedException extends UnauthorizedException {
    constructor(
        message: string = 'Authentication got failed',
        description: string = 'authentication_failed'
    ) {
        super(message, description);
    }
}
