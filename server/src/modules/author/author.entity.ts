import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Author {
    _id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: false })
    photo?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
