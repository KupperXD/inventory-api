export interface PaginateModelInterface<T> {
    findMany(...args: unknown[]): Promise<T[]>;
    count(...args: unknown[]): Promise<number>;
}
