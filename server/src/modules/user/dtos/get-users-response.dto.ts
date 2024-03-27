import { User } from '../user.entity';

export class GetUsersResponse {
    readonly data: User[];
    readonly page: number;
    readonly perPage: number;
    readonly total: number;
}
