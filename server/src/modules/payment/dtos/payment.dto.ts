import {
    ArrayNotEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString
} from 'class-validator';
import { BookPaymentDto } from './book-payment.dto';
import { PaymentMethodEnum } from '../enums/payment-methods.enum';

export class PaymentDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'PhoneIsRequired' })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: 'LocationIsRequired' })
    location: string;

    @ArrayNotEmpty()
    books: BookPaymentDto[];

    @IsEnum(PaymentMethodEnum)
    @IsNotEmpty()
    method: PaymentMethodEnum;

    @IsNotEmpty({ message: 'TotalIsRequired' })
    @IsNumber()
    @IsPositive()
    total: number;
}
