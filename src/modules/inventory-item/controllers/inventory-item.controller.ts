import ApiController from '../../../http/controllers/api.controller';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { InventoryItemService } from '../services/inventory-item.service';
import { InventoryItemOutDto } from '../dto/inventory-item-out.dto';
import { PaginatedQueryDto } from '../../../http/dto/paginated-query.dto';
import { PaginatedCollectionDto } from '../../../http/dto/paginated-collection.dto';
import { ApiOkResponsePaginatedDecorator } from '../../../decorators/api-ok-response-paginated.decorator';
import ApiServiceException from '../../../exceptions/api-service.exception';
@Controller('inventory-item')
@ApiTags('Имущество')
export class InventoryItemController extends ApiController {
    constructor(private readonly inventoryItemService: InventoryItemService) {
        super();
    }

    @ApiOperation({
        summary: 'Создания элемента имущества',
        description: 'Создания элемента имущества',
    })
    @ApiExtraModels(InventoryItemOutDto)
    @ApiOkResponse({
        schema: {
            description: 'Успешное создание',
            properties: {
                response: {
                    type: 'object',
                    $ref: getSchemaPath(InventoryItemOutDto),
                },
            },
        },
    })
    @Post()
    async create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
        try {
            const inventoryItem = await this.inventoryItemService.create(
                createInventoryItemDto,
            );

            return this.wrapResponse(new InventoryItemOutDto(inventoryItem));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @ApiOperation({
        summary: 'Список имущества',
        description: 'Список имущества с пагинацией',
    })
    @ApiExtraModels(PaginatedCollectionDto)
    @ApiOkResponsePaginatedDecorator(InventoryItemOutDto)
    @Get()
    async findAll(
        @Query()
        query: PaginatedQueryDto,
    ) {
        const result = await this.inventoryItemService.findAllPaginated(
            query.page,
        );

        return this.wrapResponse(
            new PaginatedCollectionDto({
                ...result,
                items: result.items.map((model) => {
                    return new InventoryItemOutDto(model);
                }),
            }),
        );
    }

    @ApiOperation({
        summary: 'Получить детальную имущества',
        description: 'Запрос по получению детальной информации',
    })
    @ApiOkResponse({
        schema: {
            oneOf: [
                {
                    properties: {
                        response: {
                            $ref: getSchemaPath(InventoryItemOutDto),
                        },
                    },
                },
            ],
        },
    })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const result = await this.inventoryItemService.findOne(Number(id));

            return this.wrapResponse(new InventoryItemOutDto(result));
        } catch (e) {
            if (e instanceof ApiServiceException) {
                return this.wrapResponse(e.getApiError());
            }

            throw e;
        }
    }
}
