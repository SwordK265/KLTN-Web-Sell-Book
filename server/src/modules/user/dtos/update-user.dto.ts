import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString
} from 'class-validator';
import { Role } from 'src/modules/common/constant';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty({ message: 'PasswordIsRequired' })
    @IsOptional()
    password?: string;

    @IsNumberString()
    @IsOptional()
    phone?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
