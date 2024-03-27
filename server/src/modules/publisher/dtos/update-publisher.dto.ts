import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePublisherDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    @IsOptional()
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    @IsOptional()
    slug?: string;
}
