import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    slug: string;
}
