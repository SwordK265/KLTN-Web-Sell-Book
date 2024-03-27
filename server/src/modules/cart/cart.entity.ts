import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InfoBook } from './dtos/info-book.model';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.entity';

@Schema({ timestamps: true })
export class Cart {
    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: User.name
    })
    user: string;

    @Prop({ required: true })
    books: InfoBook[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
