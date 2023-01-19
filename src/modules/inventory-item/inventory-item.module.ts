import { Module } from '@nestjs/common';
import { InventoryItemController } from './controllers/inventory-item.controller';

@Module({
    controllers: [InventoryItemController],
})
export class InventoryItemModule {}
