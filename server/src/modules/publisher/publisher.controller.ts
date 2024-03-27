import {
    Body,
    Controller,
    Logger,
    Post,
    Get,
    Query,
    Delete,
    Param,
    Put,
    UseGuards
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { Publisher } from './publisher.entity';
import { GetPublishersQuery } from './dtos/get-publishers-query.dto';
import { GetPublishersResponse } from './dtos/get-publishers-response.dto';
import { Role } from '../common/constant';
import { UseRoles } from '../common/decorators/role.decorator';
import { AuthGuard } from '../common/guard/auth.guard';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { UpdatePublisherDto } from './dtos/update-publisher.dto';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('/publishers')
export class PublisherController {
    private readonly logger = new Logger('PublisherController');

    constructor(private readonly publisherService: PublisherService) {}

    @Get()
    public async findAll(
        @Query() query: GetPublishersQuery
    ): Promise<GetPublishersResponse> {
        try {
            return await this.publisherService.findAll(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Get('/admin')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAllByAdmin(
        @Query() query: GetPublishersQuery
    ): Promise<GetPublishersResponse> {
        try {
            return await this.publisherService.findAll(query);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async create(@Body() body: CreatePublisherDto): Promise<Publisher> {
        try {
            return await this.publisherService.create(body);
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
        @Body() data: UpdatePublisherDto
    ): Promise<Publisher> {
        try {
            return await this.publisherService.update(id, data);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async delete(@Param('id') id: string): Promise<Publisher> {
        try {
            return await this.publisherService.delete(id);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
