import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Param,
    Query,
    UseGuards,
    Delete,
    Put
} from '@nestjs/common';
import { CategoryTypeService } from './category-type.service';
import { CategoryType } from './category-type.entity';
import { GetCategoryTypeResponse } from './dtos/get-category-type-response.dto';
import { GetCategoryTypeQuery } from './dtos/get-category-type-query.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { UpdateCategoryTypeDto } from './dtos/update-category-type.dto';
import { CreateCategoryTypeDto } from './dtos/create-category-type.dto';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('/category-types')
export class CategoryTypeController {
    private readonly logger = new Logger('CategoryController');

    constructor(private readonly categoryTypeService: CategoryTypeService) {}

    @Get()
    public async findAll(): Promise<CategoryType[]> {
        try {
            return await this.categoryTypeService.findAll();
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/admin')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAllByAdmin(
        @Query() query: GetCategoryTypeQuery
    ): Promise<GetCategoryTypeResponse> {
        try {
            return await this.categoryTypeService.findAllByAdmin(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async create(
        @Body() data: CreateCategoryTypeDto
    ): Promise<CategoryType> {
        try {
            return await this.categoryTypeService.create(data);
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
        @Body() data: UpdateCategoryTypeDto
    ): Promise<CategoryType> {
        try {
            return await this.categoryTypeService.update(id, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async delete(@Param('id') id: string): Promise<CategoryType> {
        try {
            return await this.categoryTypeService.delete(id);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
