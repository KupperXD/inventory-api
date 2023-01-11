import type { PaginateResultInterface } from '../../interfaces/pagination/paginate-result.interface';

export class PaginatedCollectionDto<T> {
    private readonly items: T[];
    private readonly currentPage: number;
    private readonly lastPage: number;
    private readonly perPage: number;
    private readonly prev: number | null;
    private readonly next: number | null;

    constructor(paginator: PaginateResultInterface<T>) {
        this.items = paginator.items;
        this.currentPage = paginator.currentPage;
        this.lastPage = paginator.lastPage;
        this.perPage = paginator.perPage;
        this.prev = paginator.prev;
        this.next = paginator.next;
    }
}
