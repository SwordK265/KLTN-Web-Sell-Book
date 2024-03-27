import { Injectable } from '@nestjs/common';
import { sortObject } from '../common/functions/sortParamsUrl';
import { createHmac } from 'crypto';
import * as moment from 'moment';
import * as qs from 'qs';
import { ApiConfigService } from 'src/shared/services/shared.service';
import { BookService } from '../book/book.service';
import { User } from '../user/user.entity';
import { PaymentDto } from './dtos/payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './payment.entity';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { ProductOutOfStockException } from '../common/exceptions';
import { PaymentStatus } from './enums/payment-status.enum';
import { ORDER_MESSAGE } from '../common/constant';
import { MessageResponse } from '../common/interfaces/api-response-message';
import { UserService } from '../user/user.service';
import { GetPaymentQueryDto } from './dtos/get-payment-query.dto';
import { GetPaymentResponseDto } from './dtos/get-payment-response.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
        private readonly configService: ApiConfigService,
        private readonly bookService: BookService,
        private readonly cartService: CartService,
        private readonly userService: UserService
    ) {}

    async getPayURLInVNPay(transaction: Payment, ip: string): Promise<string> {
        // Calculate price include discount
        const totalPrice = transaction.books.reduce(
            (prev, curr) =>
                prev + curr.price * (1 - curr.discount / 100) * curr.quantity,
            0
        );

        const params = {};
        params['vnp_Version'] = '2.1.0';
        params['vnp_Command'] = 'pay';
        params['vnp_TmnCode'] = this.configService.vnpayConfig.tmp;
        params['vnp_Locale'] = 'vn';
        params['vnp_CurrCode'] = 'VND';
        params['vnp_TxnRef'] = transaction._id;
        params['vnp_OrderInfo'] = `Thanh toan cho don hang ${transaction._id}`;
        params['vnp_OrderType'] = 'other';
        params['vnp_Amount'] = totalPrice * 100; // 100 do VNpay quy dinh
        params['vnp_ReturnUrl'] = this.configService.vnpayConfig.returnUrl;
        params['vnp_IpAddr'] = ip;
        params['vnp_CreateDate'] = moment().format('YYYYMMDDHHmmss');

        const vnp_Params = sortObject(params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = createHmac(
            'sha512',
            this.configService.vnpayConfig.secret
        );
        const signed = hmac
            .update(Buffer.from(signData, 'utf-8'))
            .digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        const vnpUrl = `${
            this.configService.vnpayConfig.baseUrl
        }?${qs.stringify(vnp_Params, { encode: false })}`;
        return vnpUrl;
    }

    async paymentVNPay(
        user: User,
        data: PaymentDto,
        ipArr: string
    ): Promise<any> {
        const bookIds = data.books.map((book) => book.bookId);

        const checkBooksQuantity = await this.bookService.findAllByConditions({
            quantity: 0,
            _id: { $in: bookIds }
        });

        if (!checkBooksQuantity.length) {
            // Save user history
            const transaction = await this.paymentModel.create({
                user: user._id,
                ...data
            });

            // Delete quantity books after order successfully
            await this.bookService.changeQtyBookAfterOrder(
                data.books,
                'delete'
            );

            return await this.getPayURLInVNPay(transaction, ipArr);
        } else {
            // Delete all books have quantity equal 0 in user cart
            const ids = checkBooksQuantity.map((book) => String(book._id));
            await this.cartService.updateCartAfterOrder(ids, user._id);

            throw new ProductOutOfStockException();
        }
    }

    async paymentOnDelivery(
        user: User,
        data: PaymentDto
    ): Promise<MessageResponse> {
        const bookIds = data.books.map((book) => book.bookId);

        const checkBooksQuantity = await this.bookService.findAllByConditions({
            quantity: 0,
            _id: { $in: bookIds }
        });

        if (!checkBooksQuantity.length) {
            // Save user history
            await this.paymentModel.create({
                user: user._id,
                ...data
            });

            // Delete all books in user cart after order successfully
            await this.cartService.updateCartAfterOrder(bookIds, user._id);

            // Delete quantity books after order successfully
            await this.bookService.changeQtyBookAfterOrder(
                data.books,
                'delete'
            );

            return {
                message: ORDER_MESSAGE.SUCCESS
            };
        } else {
            // Delete all books have quantity equal 0 in user cart
            const ids = checkBooksQuantity.map((book) => String(book._id));
            await this.cartService.updateCartAfterOrder(ids, user._id);

            throw new ProductOutOfStockException();
        }
    }

    async complete(paymentId: string): Promise<MessageResponse> {
        const transaction = await this.paymentModel.findOneAndUpdate(
            { _id: paymentId },
            { $set: { status: PaymentStatus.COMPLETE } },
            { new: true, runValidators: true }
        );

        // Delete all books in cart
        const bookIds = transaction.books.map((book) => book.bookId);

        await this.cartService.updateCartAfterOrder(bookIds, transaction.user);

        return {
            message: ORDER_MESSAGE.SUCCESS
        };
    }

    async abort(transactionId: string): Promise<MessageResponse> {
        const data = await this.paymentModel.findOneAndUpdate(
            { _id: transactionId },
            { $set: { status: PaymentStatus.ABORTED } },
            { new: true, runValidators: true }
        );

        // Revert all books have deleted
        await this.bookService.changeQtyBookAfterOrder(data.books, 'revert');

        return {
            message: ORDER_MESSAGE.FAIL
        };
    }

    async findByUser(
        user: User,
        query: GetPaymentQueryDto
    ): Promise<GetPaymentResponseDto> {
        // Validate user
        await this.userService.findById(user._id);

        // Query

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        const [result] = await this.paymentModel
            .aggregate([
                { $match: { user: user._id } },
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

    async findAll(query: GetPaymentQueryDto): Promise<GetPaymentResponseDto> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['user.name'] = 1);

        const [result] = await this.paymentModel
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
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
}
