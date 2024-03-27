import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Publisher {
    _id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    slug: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
