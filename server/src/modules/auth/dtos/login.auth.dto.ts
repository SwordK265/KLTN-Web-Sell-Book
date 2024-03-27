import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'EmailIsRequired' })
    email: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'PasswordIsRequired' })
    password: string;
}
