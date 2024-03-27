import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SignUpUserDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'EmailIsRequired' })
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'PasswordIsRequired' })
    @MaxLength(100)
    password: string;

    @IsOptional()
    @MaxLength(10)
    phone?: string;
}
