import { Payment } from '../payment.entity';

export class GetPaymentResponseDto {
    data: Payment[];
    page: number;
    perPage: number;
    total: number;
}
