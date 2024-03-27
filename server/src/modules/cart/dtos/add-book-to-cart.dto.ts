import { IsAlphanumeric, IsInt, IsPositive, Length } from 'class-validator';

export class AddBookToCartDto {
    @IsAlphanumeric()
    @Length(23)
    bookId: string;

    @IsInt()
    @IsPositive()
    quantity: number;
}
