/* eslint-disable @typescript-eslint/no-inferrable-types */
import { BadRequestException } from '@nestjs/common';

export class InvalidQuantityBookException extends BadRequestException {
    constructor(
        message: string = 'Invalid quantity',
        description: string = 'invalid_quantity'
    ) {
        super(message, description);
    }
}

export class InvalidBookInCartException extends BadRequestException {
    constructor(
        message: string = 'Invalid book in cart',
        description: string = 'invalid_book_in_cart'
    ) {
        super(message, description);
    }
}

export class InvalidUpdatePwdException extends BadRequestException {
    constructor(
        message: string = 'Current password or new password are incorrect',
        description: string = 'password_are_incorrect'
    ) {
        super(message, description);
    }
}

export class ProductOutOfStockException extends BadRequestException {
    constructor(
        message: string = 'Một số sản phẩm đã hết hàng',
        description: string = 'product_out_of_stock'
    ) {
        super(message, description);
    }
}

export class DuplicateNameException extends BadRequestException {
    constructor(
        message: string = 'Duplicate name',
        description: string = 'duplicate_name'
    ) {
        super(message, description);
    }
}
