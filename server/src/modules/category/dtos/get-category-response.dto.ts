import { Category } from '../category.entity';

export class GetCategoryResponse {
    data: Category[];
    page: number;
    perPage: number;
    total: number;
}
