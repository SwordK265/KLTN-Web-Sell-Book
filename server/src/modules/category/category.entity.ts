import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
    _id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
