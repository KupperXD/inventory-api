import { PaginationRepository } from '../../../components/pagination/pagination.repository';
import { InventoryItem, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { Logger } from '../../logger/service/logger.service';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import { RepositoryException } from '../../../exceptions/repository.exception';
import UnknownError from '../../../http/errors/unknown.error';
import { InventoryItemWithRelationsType } from '../models/inventory-item-with-relations.type';
import { PaginateResultInterface } from '../../../interfaces/pagination/paginate-result.interface';

@Injectable()
export class InventoryItemRepository extends PaginationRepository<
    InventoryItemWithRelationsType | InventoryItem
> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) {
        super(prisma.inventoryItem);
    }

    async create(
        dto: CreateInventoryItemDto,
    ): Promise<InventoryItemWithRelationsType> {
        try {
            const specifications =
                (dto?.specification as unknown as Prisma.JsonArray) ??
                undefined;
            return await this.prisma.inventoryItem.create({
                data: {
                    ...dto,
                    specification: specifications,
                },
                include: {
                    employee: true,
                    photo: true,
                },
            });
        } catch (e) {
            await this.handleErrorAndThrow(e);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const inventoryItem = await this.prisma.inventoryItem.delete({
                where: {
                    id,
                },
            });

            return !!inventoryItem;
        } catch (e) {
            await this.handleErrorAndThrow(e);
        }
    }

    async findOne(id: number): Promise<InventoryItemWithRelationsType> {
        try {
            return await this.prisma.inventoryItem.findUnique({
                where: {
                    id,
                },
                include: {
                    employee: true,
                    photo: true,
                },
            });
        } catch (e) {
            await this.handleErrorAndThrow(e);
        }
    }

    async update(
        id: number,
        dto: UpdateInventoryItemDto,
    ): Promise<InventoryItemWithRelationsType> {
        try {
            return await this.prisma.inventoryItem.update({
                where: {
                    id,
                },
                data: {
                    ...dto,
                    specification:
                        (dto?.specification as unknown as Prisma.JsonArray) ??
                        undefined,
                },
                include: {
                    employee: true,
                    photo: true,
                },
            });
        } catch (e) {
            await this.handleErrorAndThrow(e);
        }
    }

    public async paginate(
        options,
    ): Promise<PaginateResultInterface<InventoryItemWithRelationsType>> {
        return (await super.paginate({
            ...options,
            include: {
                employee: true,
                photo: true,
            },
        })) as PaginateResultInterface<InventoryItemWithRelationsType>;
    }

    private async handleErrorAndThrow(error: unknown): Promise<void> {
        this.logger.error(error?.toString());
        throw new RepositoryException(new UnknownError(error.toString()));
    }
}
