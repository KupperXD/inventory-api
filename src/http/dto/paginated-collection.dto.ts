export class PaginatedCollectionDto<T> {
    private readonly items: T[];

    constructor(items: T[]) {
        this.items = items;
    }
}
