import { BaseRepository } from '../base.repository';
import { PaginateModelInterface } from './interface/paginate-model.interface';
import { PaginateResultInterface } from '../../interfaces/pagination/paginate-result.interface';

type PaginatedOptions = {
    page: number;
    perPage: number;
};

export abstract class PaginationRepository<T> extends BaseRepository<T> {
    private _modelWithPagination: PaginateModelInterface<T>;

    get modelWithPagination() {
        return this._modelWithPagination;
    }

    set modelWithPagination(modelWithPagination: PaginateModelInterface<T>) {
        this._modelWithPagination = modelWithPagination;
    }

    protected constructor(modelWithPagination: PaginateModelInterface<T>) {
        super();
        this.modelWithPagination = modelWithPagination;
    }

    public async paginate(
        options: PaginatedOptions,
    ): Promise<PaginateResultInterface<T>> {
        const model = this.modelWithPagination;

        const skip =
            options.page > 0 ? options.perPage * (options.page - 1) : 0;

        const [total, data] = await Promise.all([
            model.count(),
            model.findMany({
                take: options.perPage,
                skip,
            }),
        ]);

        const lastPage = Math.ceil(total / options.perPage);

        return {
            items: data,
            total,
            currentPage: options.page,
            perPage: options.perPage,
            prev: options.page > 1 ? options.page - 1 : null,
            next: options.page < lastPage ? options.page + 1 : null,
            lastPage: lastPage,
        };
    }
}
