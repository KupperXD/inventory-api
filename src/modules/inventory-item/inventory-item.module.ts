import { Module } from '@nestjs/common';
import { InventoryItemController } from './controllers/inventory-item.controller';
import { InventoryItemService } from './services/inventory-item.service';
import { InventoryItemRepository } from './repositories/inventory-item.repository';

@Module({
    providers: [InventoryItemService, InventoryItemRepository],
    controllers: [InventoryItemController],
})
export class InventoryItemModule {}
