import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateInventoryItemDto)
export class UpdateInventoryItemDto extends PartialType(
    CreateInventoryItemDto,
) {}
