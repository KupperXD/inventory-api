import { PaginationRepository } from '../../../components/pagination/pagination.repository';
import { InventoryItem, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { Logger } from '../../logger/service/logger.service';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';

@Injectable()
export class InventoryItemRepository extends PaginationRepository<InventoryItem> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) {
        super(prisma.inventoryItem);
    }

    async create(dto: CreateInventoryItemDto): Promise<InventoryItem> {
        try {
            return await this.prisma.inventoryItem.create({
                data: {
                    ...dto,
                    specification:
                        (dto?.specification as unknown as Prisma.JsonArray) ??
                        null,
                },
            });
        } catch (e) {
            this.logger.error(e.toString());
            throw e;
        }
    }

    async delete(id: number): Promise<boolean> {
        const inventoryItem = await this.prisma.inventoryItem.delete({
            where: {
                id,
            },
        });

        return !!inventoryItem;
    }

    async findOne(id: number): Promise<InventoryItem> {
        return await this.prisma.inventoryItem.findUnique({
            where: {
                id,
            },
        });
    }

    async update(
        id: number,
        dto: UpdateInventoryItemDto,
    ): Promise<InventoryItem> {
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
        });
    }
}
