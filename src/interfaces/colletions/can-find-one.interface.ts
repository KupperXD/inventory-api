export interface CanFindOneInterface<T> {
    findOne(id: number): Promise<T>;
}
