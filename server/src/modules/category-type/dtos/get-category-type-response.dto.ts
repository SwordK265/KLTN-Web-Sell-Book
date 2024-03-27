import { CategoryType } from '../category-type.entity';

export class GetCategoryTypeResponse {
    data: CategoryType[];
    page: number;
    perPage: number;
    total: number;
}
