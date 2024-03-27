import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AuthorModule } from '../author/author.module';
import { PublisherModule } from '../publisher/publisher.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { CategoryTypeModule } from '../category-type/category-type.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
        CategoryModule,
        CategoryTypeModule,
        AuthorModule,
        PublisherModule,
        UserModule
    ],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule {}
