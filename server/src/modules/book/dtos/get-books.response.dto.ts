import { Book } from '../book.entity';

export class GetBooksResponseDto {
    data: Book[];
    page: number;
    perPage: number;
    total: number;
}
