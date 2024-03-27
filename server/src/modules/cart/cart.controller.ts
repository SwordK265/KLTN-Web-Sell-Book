import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    Put,
    Logger,
    Delete,
    Param,
    Get,
    Query
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddBookToCartDto } from './dtos/add-book-to-cart.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { JWTPayload } from '../auth/dtos/jwt-payload.model';
import { Cart } from './cart.entity';
import { UpdateBookInCartDto } from './dtos/update-book-in-cart.dto';
import { BookIdDto } from '../book/dtos/id-book.dto';
import { GetCartQueryDto } from './dtos/get-carts-query.dto';
import { GetCartsResponse } from './dtos/get-carts-response.dto';
import { UseRoles } from '../common/decorators/role.decorator';
import { Role } from '../common/constant';
import { RoleGuard } from '../common/guard/role.guard';

@Controller('/carts')
export class CartController {
    private readonly logger = new Logger('CartController');

    constructor(private readonly cartService: CartService) {}

    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @UseRoles(Role.ADMIN)
    public async findAll(
        @Query() query: GetCartQueryDto
    ): Promise<GetCartsResponse> {
        try {
            return await this.cartService.findAll(query);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Get('/user')
    public async findUserInCart(@Request() req: JWTPayload): Promise<Cart> {
        try {
            return await this.cartService.findUserCart(req.user);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    public async addBookToCart(
        @Request() req: JWTPayload,
        @Body() body: AddBookToCartDto
    ): Promise<Cart> {
        try {
            return await this.cartService.addBookToCart(body, req.user);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Post('save')
    public async saveUserCart(
        @Request() req: JWTPayload,
        @Body() body: AddBookToCartDto[]
    ): Promise<Cart> {
        try {
            return await this.cartService.saveUserCart(body, req.user);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Put(':bookId')
    public async updateBookInCart(
        @Request() req: JWTPayload,
        @Param() { bookId }: BookIdDto,
        @Body() body: UpdateBookInCartDto
    ): Promise<Cart> {
        try {
            return await this.cartService.updateBookInCart(
                bookId,
                body,
                req.user
            );
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':bookId')
    public async deleteBookInCart(
        @Request() req: JWTPayload,
        @Param() { bookId }: BookIdDto
    ): Promise<Cart> {
        try {
            return await this.cartService.deleteBookInCart(bookId, req.user);
        } catch (error) {
            this.logger.error(this.constructor.name, error);
            throw error;
        }
    }
}
