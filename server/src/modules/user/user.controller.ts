import {
    Controller,
    Get,
    Logger,
    Put,
    Request,
    UseGuards,
    Body,
    Post,
    Query,
    Param,
    Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '../common/guard/auth.guard';
import { JWTPayload } from '../auth/dtos/jwt-payload.model';
import { UpdateMeDto } from './dtos/update-me.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { GetUsersQuery } from './dtos/get-users-query.dto';
import { GetUsersResponse } from './dtos/get-users-response.dto';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { MessageResponse } from '../common/interfaces/api-response-message';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('/users')
export class UserController {
    private readonly logger = new Logger('UserController');

    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAll(
        @Query() query: GetUsersQuery
    ): Promise<GetUsersResponse> {
        try {
            return await this.userService.findAll(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async createUserByAdmin(@Body() data: CreateUserDto): Promise<User> {
        try {
            return await this.userService.createUserByAdmin(data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('me')
    @UseGuards(AuthGuard)
    public async getMe(@Request() req: JWTPayload): Promise<User> {
        try {
            return await this.userService.getMe(req.user);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post('update-password')
    @UseGuards(AuthGuard)
    public async updatePassword(
        @Request() req: JWTPayload,
        @Body() data: UpdatePasswordDto
    ): Promise<MessageResponse> {
        try {
            return await this.userService.updatePassword(req.user, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Put('me')
    @UseGuards(AuthGuard)
    public async updateMe(
        @Request() req: JWTPayload,
        @Body() data: UpdateMeDto
    ): Promise<User> {
        try {
            return await this.userService.updateMe(req.user, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async updateUserByAdmin(
        @Param('id') id: string,
        @Body() data: UpdateUserDto
    ): Promise<User> {
        try {
            return await this.userService.updateUserByAdmin(id, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async deleteUserByAdmin(@Param('id') id: string): Promise<User> {
        try {
            return await this.userService.deleteUserByAdmin(id);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
