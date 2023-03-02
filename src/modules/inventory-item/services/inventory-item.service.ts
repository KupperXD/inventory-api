import { Injectable } from '@nestjs/common';
import { InventoryItemRepository } from '../repositories/inventory-item.repository';
import ApiServiceException from '../../../exceptions/api-service.exception';
import UnknownError from '../../../http/errors/unknown.error';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { PaginateResultInterface } from '../../../interfaces/pagination/paginate-result.interface';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';
import { plainToInstance } from 'class-transformer';
import { InventoryItemWithRelationsType } from '../models/inventory-item-with-relations.type';
import { RepositoryException } from '../../../exceptions/repository.exception';

@Injectable()
export class InventoryItemService {
    private readonly PER_PAGE = 5;

    constructor(
        private readonly inventoryItemRepository: InventoryItemRepository,
    ) {}

    async create(
        createInventoryItemDto: CreateInventoryItemDto,
    ): Promise<InventoryItemWithRelationsType> {
        try {
            return await this.inventoryItemRepository.create(
                plainToInstance(CreateInventoryItemDto, createInventoryItemDto),
            );
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(new ApiServiceException(e.getApiError()));
            }

            throw e;
        }
    }

    async findAllPaginated(
        page: number,
    ): Promise<PaginateResultInterface<InventoryItemWithRelationsType>> {
        try {
            return await this.inventoryItemRepository.paginate({
                page,
                perPage: this.PER_PAGE,
            });
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(
                    new ApiServiceException(
                        new UnknownError(
                            'Не удалось получить список элементов',
                        ),
                    ),
                );
            }
        }
    }

    async update(
        id: number,
        updateInventoryItemDto: UpdateInventoryItemDto,
    ): Promise<InventoryItemWithRelationsType> {
        try {
            return await this.inventoryItemRepository.update(
                id,
                updateInventoryItemDto,
            );
        } catch (e) {
            if (e instanceof RepositoryException) {
                throw new ApiServiceException(e.getApiError());
            }

            throw e;
        }
    }

    async findOne(id: number) {
        if (Number.isNaN(id)) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        const inventoryItem = await this.inventoryItemRepository.findOne(id);

        if (!inventoryItem) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return inventoryItem;
    }

    async remove(id: number): Promise<boolean> {
        try {
            return await this.inventoryItemRepository.delete(id);
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(new ApiServiceException(e.getApiError()));
            }

            throw e;
        }
    }
}
