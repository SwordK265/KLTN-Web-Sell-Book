import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsAlphanumeric,
    Length,
    IsPositive
} from 'class-validator';

export class BookPaymentDto {
    @IsAlphanumeric()
    @Length(23)
    bookId: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    slug: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    discount: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;
}
