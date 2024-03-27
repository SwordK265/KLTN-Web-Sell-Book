import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Book } from '../book/book.entity';
import { User } from '../user/user.entity';

@Schema({ timestamps: true })
export class Review {
    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    rate: number;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
        required: true
    })
    user: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Book.name,
        required: true
    })
    book: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
