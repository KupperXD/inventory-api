import { CanFindOneInterface } from '../interfaces/colletions/can-find-one.interface';
import { CanCreateInterface } from '../interfaces/colletions/can-create.interface';

export abstract class BaseRepository<T>
    implements CanFindOneInterface<T>, CanCreateInterface<T>
{
    abstract create(...args: unknown[]): Promise<T>;

    abstract delete(id: number): Promise<boolean>;

    abstract findOne(id: number): Promise<T>;

    abstract update(id: number, dto: unknown): Promise<T>;
}
