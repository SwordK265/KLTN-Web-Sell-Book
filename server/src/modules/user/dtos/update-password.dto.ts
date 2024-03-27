import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty({ message: 'CurrentPasswordIsRequired' })
    currentPassword: string;

    @IsString()
    @IsNotEmpty({ message: 'NewPasswordIsRequired' })
    newPassword: string;
}
