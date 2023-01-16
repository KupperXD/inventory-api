export interface CanCreateInterface<T> {
    create(...args: unknown[]): Promise<T>;
}
