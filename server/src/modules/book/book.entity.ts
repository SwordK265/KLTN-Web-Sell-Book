import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Author } from '../author/author.entity';
import { Publisher } from '../publisher/publisher.entity';
import { Category } from '../category/category.entity';
import { CategoryType } from '../category-type/category-type.entity';

@Schema({ timestamps: true })
export class Book {
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false, default: 'Tiếng Việt' })
    language: string;

    @Prop({ required: false })
    size: string;

    @Prop({ required: false })
    page_number: number;

    @Prop({ required: false })
    weight: number;

    @Prop({ required: false })
    date_release: string;

    @Prop({ required: false, default: 'Bìa cứng' })
    format: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    photo: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: false })
    discount?: number;

    @Prop({ required: false })
    sold?: number;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Author.name,
        required: false
    })
    author?: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Publisher.name,
        required: false
    })
    publisher?: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Category.name,
        required: true
    })
    category: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: CategoryType.name,
        required: true
    })
    category_type: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
