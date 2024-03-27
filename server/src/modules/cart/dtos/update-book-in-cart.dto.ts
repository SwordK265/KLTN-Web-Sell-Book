import { IsInt, IsPositive } from 'class-validator';

export class UpdateBookInCartDto {
    @IsInt()
    @IsPositive()
    quantity: number;
}
