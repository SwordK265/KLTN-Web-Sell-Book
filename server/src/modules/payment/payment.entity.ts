import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentMethodEnum } from '../payment/enums/payment-methods.enum';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import { BookPaymentDto } from './dtos/book-payment.dto';

@Schema({ timestamps: true, id: false })
export class Payment {
    _id?: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
        required: true
    })
    user: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    books: BookPaymentDto[];

    @Prop({ required: true })
    total: number;

    @Prop({ required: false, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Prop({ required: true })
    method: PaymentMethodEnum;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
