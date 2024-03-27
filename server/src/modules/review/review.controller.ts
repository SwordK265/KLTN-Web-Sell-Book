import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    UseGuards,
    Request
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { BookIdDto } from '../book/dtos/id-book.dto';
import { Review } from './review.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { ReviewIdDto } from './dtos/id-review.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { JWTPayload } from '../auth/dtos/jwt-payload.model';

@Controller('/reviews')
export class ReviewController {
    private readonly logger = new Logger('ReviewController');

    constructor(private readonly reviewService: ReviewService) {}

    @Get(':bookId')
    public async findAllByBookId(
        @Param() { bookId }: BookIdDto
    ): Promise<Review[]> {
        try {
            return await this.reviewService.findAllByBookId(bookId);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    public async create(
        @Request() req: JWTPayload,
        @Body() body: CreateReviewDto
    ): Promise<Review> {
        try {
            return await this.reviewService.create(req.user, body);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Put(':reviewId')
    public async update(
        @Param() { reviewId }: ReviewIdDto,
        @Body() body: UpdateReviewDto
    ): Promise<Review> {
        try {
            return await this.reviewService.update(reviewId, body);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':reviewId')
    public async delete(@Param() { reviewId }: ReviewIdDto): Promise<Review> {
        try {
            return await this.reviewService.delete(reviewId);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
