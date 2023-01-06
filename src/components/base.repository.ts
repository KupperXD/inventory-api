export abstract class BaseRepository<T> {
    abstract create(...args: unknown[]): Promise<T>;

    abstract delete(id: number): Promise<boolean>;

    abstract findOne(id: number): Promise<T>;

    abstract update(id: number, dto: unknown): Promise<T>;
}
