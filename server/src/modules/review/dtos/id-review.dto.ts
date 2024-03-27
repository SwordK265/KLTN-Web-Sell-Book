import { IsAlphanumeric, Length } from 'class-validator';

export class ReviewIdDto {
    @IsAlphanumeric()
    @Length(23)
    reviewId: string;
}
