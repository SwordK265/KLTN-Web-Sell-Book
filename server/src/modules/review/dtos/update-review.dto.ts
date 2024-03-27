import {
    IsString,
    IsNotEmpty,
    IsInt,
    MaxLength,
    IsAlphanumeric,
    Length,
    IsOptional
} from 'class-validator';

export class UpdateReviewDto {
    @IsString()
    @IsNotEmpty({ message: 'TitleIsRequired' })
    @IsOptional()
    content?: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'TitleIsRequired' })
    @IsOptional()
    title: string;

    @IsInt()
    @IsOptional()
    rate?: number;

    @IsAlphanumeric()
    @Length(23)
    user_id: string;

    @IsAlphanumeric()
    @Length(23)
    book_id: string;
}
