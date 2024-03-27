import {
    IsEmail,
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString
} from 'class-validator';
import { Role } from 'src/modules/common/constant';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'PasswordIsRequired' })
    password: string;

    @IsNumberString()
    @IsOptional()
    phone?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
