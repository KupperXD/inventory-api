import type { PaginateResultInterface } from '../../interfaces/pagination/paginate-result.interface';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedCollectionDto<T> {
    private readonly items: T[];

    @ApiProperty({
        description: 'Текущая страница',
        type: Number,
        example: 1,
    })
    private readonly currentPage: number;

    @ApiProperty({
        description: 'Последняя страница',
        type: Number,
        example: 1,
    })
    private readonly lastPage: number;

    @ApiProperty({
        description: 'Элементов на странице',
        type: Number,
        example: 1,
    })
    private readonly perPage: number;

    @ApiProperty({
        description: 'Предыдущая страница',
        type: Number,
        example: 1,
    })
    private readonly prev: number | null;

    @ApiProperty({
        description: 'Новая страница',
        type: Number,
        example: 1,
    })
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
