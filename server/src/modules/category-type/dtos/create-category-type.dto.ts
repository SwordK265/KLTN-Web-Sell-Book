import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryTypeDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    slug: string;

    @IsString()
    @IsNotEmpty({ message: 'CategoryNameIsRequired' })
    category: string;
}
