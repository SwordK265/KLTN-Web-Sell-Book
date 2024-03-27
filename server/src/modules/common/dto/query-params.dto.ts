import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from './paginate-params.dto';

export class QueryParamsBaseDto extends PaginationParamsDto {
    @IsOptional()
    @IsString()
    readonly q?: string;

    skip?: number;

    limit?: number;

    sortKey?: string;

    keyword?: 1 | -1;

    constructor() {
        super();
        Object.defineProperty(this, 'skip', {
            get() {
                const temp = (Number(this.page) - 1) * Number(this.perPage);

                return temp > 0 ? temp : 0;
            }
        });
        Object.defineProperty(this, 'limit', {
            get() {
                return Number(this.perPage) > 0 ? Number(this.perPage) : 0;
            }
        });
        Object.defineProperty(this, 'sortKey', {
            get() {
                const split = this.orderBy?.split('|');

                return split[0];
            }
        });
        Object.defineProperty(this, 'keyword', {
            get() {
                const split = this.orderBy?.split('|');

                return split[1] === '1' ? 1 : -1;
            }
        });
    }
}
