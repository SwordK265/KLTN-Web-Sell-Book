import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { AddBookToCartDto } from './dtos/add-book-to-cart.dto';
import { User } from '../user/user.entity';
import { BookService } from '../book/book.service';
import { UpdateBookInCartDto } from './dtos/update-book-in-cart.dto';
import {
    InvalidBookInCartException,
    InvalidQuantityBookException
} from '../common/exceptions';
import { GetCartQueryDto } from './dtos/get-carts-query.dto';
import { GetCartsResponse } from './dtos/get-carts-response.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        private readonly bookService: BookService
    ) {}

    async findAll(query: GetCartQueryDto): Promise<GetCartsResponse> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['user.name'] = 1);

        const [result] = await this.cartModel
            .aggregate([
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        books: {
                            $map: {
                                input: '$books',
                                as: 'book',
                                in: {
                                    book: { $toObjectId: '$$book.book' },
                                    quantity: '$$book.quantity'
                                }
                            }
                        }
                    }
                },
                {
                    $unwind: {
                        path: '$books',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'books',
                        localField: 'books.book',
                        foreignField: '_id',
                        as: 'bookDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$bookDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        user: { $first: '$user' },
                        books: {
                            $push: {
                                book: '$bookDetails',
                                quantity: '$books.quantity'
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        pipeline: [{ $project: { name: 1 } }],
                        as: 'user'
                    }
                },
                { $match: { 'user.name': { $regex: search, $options: 'i' } } },
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

    async findUserCart(user: User): Promise<Cart> {
        let booksInCart = await this.cartModel
            .findOne({ user: user._id })
            .populate({
                path: 'books',
                populate: {
                    path: 'book',
                    model: 'Book',
                    select: '_id name price quantity slug photo discount'
                }
            });

        // Check if user not has cart, then create
        if (!booksInCart) {
            booksInCart = await this.cartModel.create({
                user: user._id,
                books: []
            });
        }

        return booksInCart;
    }

    async addBookToCart(data: AddBookToCartDto, user: User): Promise<Cart> {
        // Check user cart exist
        const userCart = await this.cartModel.findOne({ user: user._id });

        // Check book quantity
        const book = await this.bookService.findById(data.bookId);

        if (data.quantity > book.quantity) {
            throw new InvalidQuantityBookException();
        }

        // Cart data
        const dataCart: Cart = {
            user: user._id,
            books: [
                {
                    book: data.bookId,
                    quantity: data.quantity
                }
            ]
        };

        // If user not has cart, create new cart
        if (!userCart) {
            const cart = await this.cartModel.create(dataCart);

            return cart;
        }

        // If user has cart, push new cart data into db
        const checkBookIdExist = userCart.books.find(
            (el) => el.book === data.bookId
        );

        if (checkBookIdExist) {
            checkBookIdExist.quantity += data.quantity;

            if (checkBookIdExist.quantity > book.quantity) {
                throw new InvalidQuantityBookException();
            }

            return await this.cartModel
                .findOneAndUpdate(
                    {
                        user: user._id,
                        'books.book': data.bookId
                    },
                    {
                        'books.$.quantity': checkBookIdExist.quantity
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                )
                .populate({
                    path: 'books',
                    populate: {
                        path: 'book',
                        model: 'Book',
                        select: '_id name price quantity slug photo discount'
                    }
                });
        } else {
            userCart.books.push(dataCart.books[0]);

            return await this.cartModel
                .findOneAndUpdate(
                    { user: user._id },
                    { books: userCart.books },
                    {
                        new: true,
                        runValidators: true
                    }
                )
                .populate({
                    path: 'books',
                    populate: {
                        path: 'book',
                        model: 'Book',
                        select: '_id name price quantity slug photo discount'
                    }
                });
        }
    }

    async updateBookInCart(
        bookId: string,
        data: UpdateBookInCartDto,
        user: User
    ): Promise<Cart> {
        const book = await this.bookService.findById(bookId);

        if (data.quantity > book.quantity) {
            throw new InvalidQuantityBookException();
        }

        const result = await this.cartModel
            .findOneAndUpdate(
                {
                    user: user._id,
                    'books.book': bookId
                },
                {
                    'books.$.quantity': data.quantity
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate({
                path: 'books',
                populate: {
                    path: 'book',
                    model: 'Book',
                    select: '_id name price quantity slug photo discount'
                }
            });

        if (!result) {
            throw new InvalidBookInCartException();
        }

        return result;
    }

    async deleteBookInCart(bookId: string, user: User | string): Promise<Cart> {
        // Validate bookId
        await this.bookService.findById(bookId);

        const result = await this.cartModel
            .findOneAndUpdate(
                {
                    user: typeof user === 'string' ? user : user._id,
                    'books.book': bookId
                },
                {
                    $pull: { books: { book: bookId } }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate({
                path: 'books',
                populate: {
                    path: 'book',
                    model: 'Book',
                    select: '_id name price photo discount'
                }
            });

        if (!result) {
            throw new InvalidBookInCartException();
        }

        return result;
    }

    async updateCartAfterOrder(
        bookIds: string[],
        userId: string
    ): Promise<void> {
        await this.cartModel.updateOne(
            {
                user: userId
            },
            {
                $pull: { books: { book: { $in: bookIds } } }
            },
            {
                runValidators: true
            }
        );
    }

    async saveUserCart(books: AddBookToCartDto[], user: User): Promise<Cart> {
        return await this.cartModel
            .findOneAndUpdate(
                {
                    user: user._id
                },
                {
                    books
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate({
                path: 'books',
                populate: {
                    path: 'book',
                    model: 'Book',
                    select: '_id name price quantity slug photo discount'
                }
            });
    }
}
