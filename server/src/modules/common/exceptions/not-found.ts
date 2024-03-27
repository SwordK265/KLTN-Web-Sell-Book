/* eslint-disable @typescript-eslint/no-inferrable-types */
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
    constructor(
        message: string = 'User is not found',
        description: string = 'user_not_found'
    ) {
        super(message, description);
    }
}

export class BookNotFoundException extends NotFoundException {
    constructor(
        message: string = 'Book is not found',
        description: string = 'book_not_found'
    ) {
        super(message, description);
    }
}

export class AuthorNotFoundException extends NotFoundException {
    constructor(
        message: string = 'Author is not found',
        description: string = 'author_not_found'
    ) {
        super(message, description);
    }
}

export class PublisherNotFoundException extends NotFoundException {
    constructor(
        message: string = 'Publisher is not found',
        description: string = 'publisher_not_found'
    ) {
        super(message, description);
    }
}

export class CategoryNotFoundException extends NotFoundException {
    constructor(
        message: string = 'Category is not found',
        description: string = 'category_not_found'
    ) {
        super(message, description);
    }
}

export class CategoryTypeNotFoundException extends NotFoundException {
    constructor(
        message: string = 'CategoryType is not found',
        description: string = 'category_type_not_found'
    ) {
        super(message, description);
    }
}

export class ReviewNotFoundException extends NotFoundException {
    constructor(
        message: string = 'Review is not found',
        description: string = 'review_type_not_found'
    ) {
        super(message, description);
    }
}
