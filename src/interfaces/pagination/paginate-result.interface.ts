export interface PaginateResultInterface<T> {
    items: T[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
}
