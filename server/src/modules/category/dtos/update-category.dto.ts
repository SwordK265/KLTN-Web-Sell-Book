import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    @IsOptional()
    slug?: string;
}
