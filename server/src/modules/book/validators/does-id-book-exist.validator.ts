import { Injectable } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { BookService } from '../book.service';

/**
 * Custom validation constraint
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class DoesBookExistById implements ValidatorConstraintInterface {
    constructor(private readonly bookService: BookService) {}

    /**
     * Check book exist or not
     *
     * @param id - the id to be checked
     */
    public async validate(bookId: string): Promise<boolean> {
        try {
            const count = await this.bookService.countById(bookId);

            return count > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Default error message
     */
    public defaultMessage(): string {
        return 'BookNotFound.';
    }
}
