import {
    Body,
    Controller,
    Logger,
    Post,
    Get,
    Param,
    Query,
    UseGuards,
    Delete,
    Put
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { GetBooksQueryDto } from './dtos/get-books-query.dto';
import { GetBooksResponseDto } from './dtos/get-books.response.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { UpdateBookDto } from './dtos/update-book.dto';
import { CreateBookDto } from './dtos/create-book.dto';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('/books')
export class BookController {
    private readonly logger = new Logger('BookController');

    constructor(private readonly bookService: BookService) {}

    @Get()
    public async findAll(
        @Query() query: GetBooksQueryDto
    ): Promise<GetBooksResponseDto> {
        try {
            return await this.bookService.findAll(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/admin')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAllByAdmin(
        @Query() query: GetBooksQueryDto
    ): Promise<GetBooksResponseDto> {
        try {
            return await this.bookService.findAllByAdmin(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/top-20-sold-out')
    public async findTop20BooksSoldOut(): Promise<Book[]> {
        try {
            return await this.bookService.findTop20BooksSoldOut();
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('cate/:slug')
    public async findBySlug(
        @Query() query: GetBooksQueryDto,
        @Param('slug') slug: string
    ): Promise<GetBooksResponseDto> {
        try {
            return await this.bookService.findAllBySlug(slug, query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async create(@Body() data: CreateBookDto): Promise<Book> {
        try {
            return await this.bookService.create(data);
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
        @Body() data: UpdateBookDto
    ): Promise<Book> {
        try {
            return await this.bookService.update(id, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async delete(@Param('id') id: string): Promise<Book> {
        try {
            return await this.bookService.delete(id);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/:slug')
    public async getBookBySlug(@Param('slug') slug: string): Promise<Book> {
        try {
            return this.bookService.findBySlug(slug);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
