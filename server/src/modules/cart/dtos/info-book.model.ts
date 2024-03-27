import { Prop } from '@nestjs/mongoose';
import { IsAlphanumeric, IsInt, IsPositive, Length } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { Book } from 'src/modules/book/book.entity';

export class InfoBook {
    @IsAlphanumeric()
    @Length(23)
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Book.name })
    book: string;

    @IsInt()
    @IsPositive()
    quantity: number;
}
