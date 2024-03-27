/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ForbiddenException } from '@nestjs/common';

export class ForbiddenSourceException extends ForbiddenException {
    constructor(
        message: string = 'Forbidden resource',
        description: string = 'forbidden'
    ) {
        super(message, description);
    }
}
