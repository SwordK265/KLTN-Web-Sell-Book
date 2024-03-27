import { IsAlphanumeric, Length } from 'class-validator';

export class BookIdDto {
    @IsAlphanumeric()
    @Length(23)
    bookId: string;
}
