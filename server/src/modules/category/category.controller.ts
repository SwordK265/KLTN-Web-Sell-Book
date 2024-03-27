import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Put,
    Query,
    UseGuards,
    Delete,
    Post
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { AuthGuard } from '../common/guard/auth.guard';
import { GetCategoryResponse } from './dtos/get-category-response.dto';
import { GetCategoryQuery } from './dtos/get-category-query.dto';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { RoleGuard } from '../common/guard/role.guard';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('/categories')
export class CategoryController {
    private readonly logger = new Logger('CategoryController');

    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    public async findAll(): Promise<Category[]> {
        try {
            return await this.categoryService.findAll();
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/admin')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAllByAdmin(
        @Query() query: GetCategoryQuery
    ): Promise<GetCategoryResponse> {
        try {
            return await this.categoryService.findAllByAdmin(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/:slug')
    public async findBySlug(@Param('slug') slug: string): Promise<Category> {
        try {
            return await this.categoryService.findBySlug(slug);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async create(@Body() data: CreateCategoryDto): Promise<Category> {
        try {
            return await this.categoryService.create(data);
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
        @Body() data: UpdateCategoryDto
    ): Promise<Category> {
        try {
            return await this.categoryService.update(id, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async delete(@Param('id') id: string): Promise<Category> {
        try {
            return await this.categoryService.delete(id);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
