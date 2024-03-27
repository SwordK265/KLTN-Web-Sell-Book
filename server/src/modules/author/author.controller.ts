import {
    Body,
    Controller,
    Logger,
    Post,
    Get,
    Query,
    Put,
    Delete,
    Param,
    UseGuards
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';
import { GetAuthorQueryDto } from './dtos/get-authors-query.dto';
import { GetAuthorsResponse } from './dtos/get-authors-response.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('/authors')
export class AuthorController {
    private readonly logger = new Logger('AuthorController');

    constructor(private readonly authorService: AuthorService) {}

    @Get()
    public async findAll(
        @Query() query: GetAuthorQueryDto
    ): Promise<GetAuthorsResponse> {
        try {
            return await this.authorService.findAll(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/admin')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAllByAdmin(
        @Query() query: GetAuthorQueryDto
    ): Promise<GetAuthorsResponse> {
        try {
            return await this.authorService.findAll(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('outstanding')
    public async findOutstandingAuthor(): Promise<Author> {
        try {
            return await this.authorService.getOutstandingAuthor();
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async create(@Body() body: CreateAuthorDto): Promise<Author> {
        try {
            return await this.authorService.create(body);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async update(
        @Param('id') id: string,
        @Body() data: UpdateAuthorDto
    ): Promise<Author> {
        try {
            return await this.authorService.update(id, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async delete(@Param('id') id: string): Promise<Author> {
        try {
            return await this.authorService.delete(id);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
