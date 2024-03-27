import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpUserDto } from './dtos/sign-up.auth.dto';
import { LoginUserDto } from './dtos/login.auth.dto';
import { AssignLoginUser } from './dtos/assign-login-user.dto';
import { LoginFailedException } from '../common/exceptions';

@Injectable()
export class AuthService {
    /**
     * inject the JwtService provider into the AuthService
     */
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async signUp(userDto: SignUpUserDto): Promise<AssignLoginUser> {
        const hashPassword = await bcrypt.hash(userDto.password, 12);

        userDto.password = hashPassword;
        const user = await this.userService.create(userDto);

        user.password = undefined;

        const accessToken = await this.jwtService.signAsync({ id: user._id });

        const result = new AssignLoginUser(user, accessToken);

        return result;
    }

    async logIn(userDto: LoginUserDto): Promise<AssignLoginUser> {
        const user = await this.userService.findEmail(userDto.email);

        const match = await bcrypt.compare(userDto.password, user.password);

        if (!match) {
            throw new LoginFailedException();
        }

        const accessToken = await this.jwtService.signAsync({ id: user._id });

        const result = new AssignLoginUser(user, accessToken);

        return result;
    }
}
