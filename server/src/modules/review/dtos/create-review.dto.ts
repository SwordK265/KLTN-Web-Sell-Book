import {
    IsString,
    IsInt,
    MaxLength,
    IsAlphanumeric,
    Length,
    Min,
    Max,
    Validate,
    IsNotEmpty
} from 'class-validator';
import { DoesBookExistById } from 'src/modules/book/validators/does-id-book-exist.validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty({ message: 'ContentIsRequired' })
    content: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'TitleIsRequired' })
    title: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rate: number;

    @IsAlphanumeric()
    @Length(23)
    // @Validate(DoesBookExistById)
    bookId: string;
}
