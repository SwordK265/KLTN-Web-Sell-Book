import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'DescriptionIsRequired' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    slug: string;
}
