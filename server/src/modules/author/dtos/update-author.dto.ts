import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAuthorDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty({ message: 'DescriptionIsRequired' })
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    @IsOptional()
    slug?: string;
}
