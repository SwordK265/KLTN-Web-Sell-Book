import { Publisher } from '../publisher.entity';

export class GetPublishersResponse {
    data: Publisher[];
    page: number;
    perPage: number;
    total: number;
}
