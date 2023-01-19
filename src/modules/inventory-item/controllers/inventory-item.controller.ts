import ApiController from '../../../http/controllers/api.controller';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';

@Controller('inventory-item')
@ApiTags('Имущество')
export class InventoryItemController extends ApiController {
    @Post()
    async create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
        console.log('create', {
            item: createInventoryItemDto,
        });

        return createInventoryItemDto;
    }
}
