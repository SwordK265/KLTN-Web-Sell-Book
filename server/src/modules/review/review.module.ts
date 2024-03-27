import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserModule } from '../user/user.module';
import { DoesBookExistById } from '../book/validators/does-id-book-exist.validator';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema }
        ]),
        UserModule,
        BookModule
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService]
})
export class ReviewModule {}
