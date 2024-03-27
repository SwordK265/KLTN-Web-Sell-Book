import { Author } from '../author.entity';

export class GetAuthorsResponse {
    data: Author[];
    page: number;
    perPage: number;
    total: number;
}
