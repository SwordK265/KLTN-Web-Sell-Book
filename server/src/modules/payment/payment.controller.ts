import {
    Body,
    Controller,
    Ip,
    Post,
    UseGuards,
    Request,
    Get,
    Redirect,
    Query
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JWTPayload } from '../auth/dtos/jwt-payload.model';
import { AuthGuard } from '../common/guard/auth.guard';
import { PaymentDto } from './dtos/payment.dto';
import { MessageResponse } from '../common/interfaces/api-response-message';
import { GetPaymentQueryDto } from './dtos/get-payment-query.dto';
import { GetPaymentResponseDto } from './dtos/get-payment-response.dto';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAll(
        @Query() query: GetPaymentQueryDto
    ): Promise<GetPaymentResponseDto> {
        try {
            return await this.paymentService.findAll(query);
        } catch (error) {
            throw error;
        }
    }

    @Get('/user')
    @UseGuards(AuthGuard)
    public async findByUser(
        @Request() req: JWTPayload,
        @Query() query: GetPaymentQueryDto
    ): Promise<GetPaymentResponseDto> {
        try {
            return await this.paymentService.findByUser(req.user, query);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Post('vn-pay')
    public async paymentVNPay(
        @Request() req: JWTPayload,
        @Body() data: PaymentDto,
        @Ip() ipAddr: string
    ): Promise<string> {
        try {
            return await this.paymentService.paymentVNPay(
                req.user,
                data,
                ipAddr
            );
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Post('on-delivery')
    public async paymentOnDelivery(
        @Request() req: JWTPayload,
        @Body() data: PaymentDto
    ): Promise<MessageResponse> {
        try {
            return await this.paymentService.paymentOnDelivery(req.user, data);
        } catch (error) {
            throw error;
        }
    }

    @Get('vnpay_return')
    @Redirect('http://localhost:8080/cart', 301)
    public async vnpayReturn(@Query() params: any): Promise<MessageResponse> {
        if (params.vnp_ResponseCode === '00') {
            return await this.paymentService.complete(params.vnp_TxnRef);
        } else {
            return await this.paymentService.abort(params.vnp_TxnRef);
        }
    }
}
