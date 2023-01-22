import { Injectable } from '@nestjs/common';
import { InventoryItemRepository } from '../repositories/inventory-item.repository';
import { InventoryItem } from '@prisma/client';
import ApiServiceException from '../../../exceptions/api-service.exception';
import UnknownError from '../../../http/errors/unknown.error';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { PaginateResultInterface } from '../../../interfaces/pagination/paginate-result.interface';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';
import { plainToInstance } from 'class-transformer';
import { InventoryItemWithRelationsType } from '../models/inventory-item-with-relations.type';

@Injectable()
export class InventoryItemService {
    private readonly PER_PAGE = 20;

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
            throw new ApiServiceException(
                new UnknownError('Не удалось создать сущность.'),
            );
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
            throw new ApiServiceException(
                new UnknownError('Не удалось получить список элементов'),
            );
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
            throw new ApiServiceException(
                new UnknownError('Не удалось обновить сущность'),
            );
        }
    }

    async findOne(id: number) {
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
            throw new ApiServiceException(new EntityNotFoundError());
        }
    }
}
