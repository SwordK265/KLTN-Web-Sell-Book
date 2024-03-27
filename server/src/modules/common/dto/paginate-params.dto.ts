import { IsOptional } from 'class-validator';

export class PaginationParamsDto {
    @IsOptional()
    readonly page?: number = 1;

    @IsOptional()
    readonly perPage?: number = 20;

    @IsOptional()
    readonly orderBy?: string;
}
