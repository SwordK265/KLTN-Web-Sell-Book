import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryTypeDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'CategoryNameIsRequired' })
    category?: string;
}
