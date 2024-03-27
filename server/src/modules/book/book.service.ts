import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.entity';
import { BookNotFoundException } from '../common/exceptions';
import { BookPaymentDto } from '../payment/dtos/book-payment.dto';
import { GetBooksQueryDto } from './dtos/get-books-query.dto';
import { GetBooksResponseDto } from './dtos/get-books.response.dto';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { CategoryService } from '../category/category.service';
import { CategoryTypeService } from '../category-type/category-type.service';
import { AuthorService } from '../author/author.service';
import { PublisherService } from '../publisher/publisher.service';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        private readonly categoryService: CategoryService,
        private readonly categoryTypeService: CategoryTypeService,
        private readonly authorService: AuthorService,
        private readonly publisherService: PublisherService
    ) {}

    async findAllByConditions(conditions: object): Promise<Book[]> {
        return await this.bookModel.find(conditions);
    }

    async findById(bookId: string): Promise<Book> {
        const result = await this.bookModel.findById(bookId);

        if (!result) {
            throw new BookNotFoundException();
        }

        return result;
    }

    async create(data: CreateBookDto): Promise<Book> {
        // Find Category
        const category = await this.categoryService.findByName(data.category);

        // Find CategoryType
        const categoryType =
            await this.categoryTypeService.findByNameAndCategory(
                category._id,
                data.category_type
            );

        // Find Author
        const author = await this.authorService.findName(data.author);

        // Find Publisher
        const publisher = await this.publisherService.findByName(
            data.publisher
        );

        const result = await this.bookModel.create({
            ...data,
            author: author._id,
            publisher: publisher._id,
            category: category._id,
            category_type: categoryType._id,
            slug: data.slug
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .split(' ')
                .join('-')
        });

        return result;
    }

    async update(bookId: string, data: UpdateBookDto): Promise<Book> {
        // Find Category
        const category = await this.categoryService.findByName(data.category);

        // Find CategoryType
        const categoryType =
            await this.categoryTypeService.findByNameAndCategory(
                category._id,
                data.category_type
            );

        // Find Author
        const author = await this.authorService.findName(data.author);

        // Find Publisher
        const publisher = await this.publisherService.findByName(
            data.publisher
        );

        const result = await this.bookModel.findByIdAndUpdate(
            bookId,
            {
                ...data,
                author: author._id,
                publisher: publisher._id,
                category: category._id,
                category_type: categoryType._id,
                slug: data.slug
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .split(' ')
                    .join('-')
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!result) {
            throw new BookNotFoundException();
        }

        return result;
    }

    async delete(bookId: string): Promise<Book> {
        const result = await this.bookModel.findByIdAndDelete(bookId);

        if (!result) {
            throw new BookNotFoundException();
        }

        return result;
    }

    async countById(id: string): Promise<number> {
        const count = await this.bookModel.count({ _id: id });

        return count;
    }

    async findAll(query: GetBooksQueryDto): Promise<GetBooksResponseDto> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        const [result] = await this.bookModel
            .aggregate([
                {
                    $lookup: {
                        from: 'authors',
                        foreignField: '_id',
                        localField: 'author',
                        as: 'author'
                    }
                },
                {
                    $lookup: {
                        from: 'publishers',
                        foreignField: '_id',
                        localField: 'publisher',
                        as: 'publisher'
                    }
                },
                {
                    $match: {
                        $or: [
                            { name: { $regex: new RegExp(search, 'i') } },
                            {
                                'author.name': {
                                    $regex: new RegExp(search, 'i')
                                }
                            },
                            {
                                'author.slug': {
                                    $regex: new RegExp(search, 'i')
                                }
                            },
                            {
                                'publisher.slug': {
                                    $regex: new RegExp(search, 'i')
                                }
                            }
                        ]
                    }
                },
                { $sort: sortObj },
                {
                    $facet: {
                        data: [{ $skip: query.skip }, { $limit: query.limit }],
                        total: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: '$total'
                },
                {
                    $project: {
                        data: 1,
                        total: '$total.count'
                    }
                }
            ])
            .collation({ locale: 'vi' });

        return {
            data: result?.data || [],
            page: Number(query.page),
            perPage: Number(query.perPage),
            total: result?.total || 0
        };
    }

    async findAllBySlug(
        slug: string,
        query: GetBooksQueryDto
    ): Promise<GetBooksResponseDto> {
        // Search
        const search = query.q || '';

        console.log(search);

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        const [result] = await this.bookModel
            .aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        foreignField: '_id',
                        localField: 'category',
                        as: 'category'
                    }
                },
                {
                    $lookup: {
                        from: 'categorytypes',
                        foreignField: '_id',
                        localField: 'category_type',
                        as: 'type'
                    }
                },
                {
                    $match: {
                        $or: [{ 'category.slug': slug }, { 'type.slug': slug }]
                    }
                },
                {
                    $lookup: {
                        from: 'authors',
                        foreignField: '_id',
                        localField: 'author',
                        as: 'author'
                    }
                },
                {
                    $lookup: {
                        from: 'publishers',
                        foreignField: '_id',
                        localField: 'publisher',
                        as: 'publisher'
                    }
                },
                {
                    $match: {
                        $or: [
                            { name: { $regex: new RegExp(search, 'i') } },
                            {
                                'author.name': {
                                    $regex: new RegExp(search, 'i')
                                }
                            },
                            {
                                'author.slug': {
                                    $regex: new RegExp(search, 'i')
                                }
                            },
                            {
                                'publisher.slug': {
                                    $regex: new RegExp(search, 'i')
                                }
                            }
                        ]
                    }
                },
                { $sort: sortObj },
                {
                    $facet: {
                        data: [{ $skip: query.skip }, { $limit: query.limit }],
                        total: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: '$total'
                },
                {
                    $project: {
                        data: 1,
                        total: '$total.count'
                    }
                }
            ])
            .collation({ locale: 'vi' });

        return {
            data: result?.data || [],
            page: Number(query.page),
            perPage: Number(query.perPage),
            total: result?.total || 0
        };
    }

    async findBySlug(slug: string): Promise<Book> {
        const book = await this.bookModel
            .findOne({ slug })
            .populate('author')
            .populate('publisher')
            .populate('category')
            .populate('category_type');

        if (!book) {
            throw new BookNotFoundException();
        }

        return book;
    }

    async findTop20BooksSoldOut(): Promise<Book[]> {
        const books = await this.bookModel.aggregate([
            { $sort: { sold: -1 } },
            { $limit: 20 },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            }
        ]);

        return books;
    }

    async changeQtyBookAfterOrder(
        books: BookPaymentDto[],
        action: string
    ): Promise<void> {
        const updateBooks = [];

        for (const book of books) {
            const filter = {
                _id: book.bookId
            };

            const update = {
                $inc: {
                    quantity:
                        action === 'delete'
                            ? Number(-book.quantity)
                            : Number(book.quantity)
                }
            };

            updateBooks.push({
                updateMany: { filter, update }
            });
        }

        await this.bookModel.bulkWrite(updateBooks);
    }

    async findAllByAdmin(
        query: GetBooksQueryDto
    ): Promise<GetBooksResponseDto> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        const [result] = await this.bookModel
            .aggregate([
                {
                    $lookup: {
                        from: 'authors',
                        foreignField: '_id',
                        localField: 'author',
                        as: 'author'
                    }
                },
                {
                    $lookup: {
                        from: 'publishers',
                        foreignField: '_id',
                        localField: 'publisher',
                        as: 'publisher'
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        foreignField: '_id',
                        localField: 'category',
                        as: 'category'
                    }
                },
                {
                    $lookup: {
                        from: 'categorytypes',
                        foreignField: '_id',
                        localField: 'category_type',
                        as: 'category_type'
                    }
                },
                {
                    $match: {
                        $or: [
                            { name: { $regex: new RegExp(search, 'i') } },
                            {
                                'author.name': {
                                    $regex: new RegExp(search, 'i')
                                }
                            },
                            {
                                'publisher.name': {
                                    $regex: new RegExp(search, 'i')
                                }
                            }
                        ]
                    }
                },
                { $sort: sortObj },
                {
                    $facet: {
                        data: [{ $skip: query.skip }, { $limit: query.limit }],
                        total: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: '$total'
                },
                {
                    $project: {
                        data: 1,
                        total: '$total.count'
                    }
                }
            ])
            .collation({ locale: 'vi' });

        return {
            data: result?.data || [],
            page: Number(query.page),
            perPage: Number(query.perPage),
            total: result?.total || 0
        };
    }
}
