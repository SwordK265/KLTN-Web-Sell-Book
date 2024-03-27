import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

@Schema({ timestamps: true, id: false })
export class User {
    _id?: string;

    @Prop({ required: true })
    name: string;

    @Prop({ unique: true, required: true, lowercase: true })
    @IsEmail()
    email: string;

    @Prop({ select: false, required: true })
    password: string;

    @Prop()
    phone: string;

    @Prop({ default: 'user' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
