import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePublisherDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    slug: string;
}
