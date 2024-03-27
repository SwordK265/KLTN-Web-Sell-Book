import { Cart } from '../cart.entity';

export class GetCartsResponse {
    data: Cart[];
    page: number;
    perPage: number;
    total: number;
}
