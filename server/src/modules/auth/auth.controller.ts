import { Controller, Post, Body, Logger } from '@nestjs/common';
import { SignUpUserDto } from './dtos/sign-up.auth.dto';
import { LoginUserDto } from './dtos/login.auth.dto';
import { AuthService } from './auth.service';
import { AssignLoginUser } from './dtos/assign-login-user.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body() userDto: SignUpUserDto): Promise<AssignLoginUser> {
        try {
            return await this.authService.signUp(userDto);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post('/login')
    async logIn(@Body() userDto: LoginUserDto): Promise<AssignLoginUser> {
        try {
            return await this.authService.logIn(userDto);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
