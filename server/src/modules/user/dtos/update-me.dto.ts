import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEmail,
    IsNumberString
} from 'class-validator';

export class UpdateMeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name?: string;

    @IsEmail()
    @IsNotEmpty({ message: 'EmailIsRequired' })
    @IsOptional()
    email?: string;

    @IsNumberString()
    @IsOptional()
    phone?: string;
}
