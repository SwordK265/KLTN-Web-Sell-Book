import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Category } from '../category/category.entity';

@Schema({ timestamps: true })
export class CategoryType {
    _id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Category.name,
        required: true
    })
    category: string;

    @Prop({ required: true, unique: true })
    slug: string;
}

export const CategoryTypeSchema = SchemaFactory.createForClass(CategoryType);
