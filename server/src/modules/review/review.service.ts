import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.entity';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { User } from '../user/user.entity';
import { BookService } from '../book/book.service';
import { ReviewNotFoundException } from '../common/exceptions';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
        private readonly bookService: BookService
    ) {}

    async create(user: User, data: CreateReviewDto): Promise<Review> {
        const book = await this.bookService.findById(data.bookId);

        const review: Review = {
            title: data.title,
            content: data.content,
            rate: data.rate,
            book: book._id,
            user: user._id
        };

        return await this.reviewModel.create(review);
    }

    async findAllByBookId(bookId: string): Promise<Review[]> {
        const book = await this.bookService.findById(bookId);

        const result = await this.reviewModel
            .find({ book: book._id })
            .populate('book');

        return result;
    }

    async update(id: string, data: UpdateReviewDto): Promise<Review> {
        const result = await this.reviewModel.findByIdAndUpdate(id, data);

        if (!result) {
            throw new ReviewNotFoundException();
        }

        return result;
    }

    async delete(id: string): Promise<Review> {
        const result = await this.reviewModel.findByIdAndDelete(id);

        if (!result) {
            throw new ReviewNotFoundException();
        }

        return result;
    }
}
