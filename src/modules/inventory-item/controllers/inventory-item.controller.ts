import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBody,
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
import { ErrorDto } from '../../../http/dto/errors/error.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import { SuccessDto } from '../../../http/dto/success.dto';
import { WithAuthGuardController } from '../../../http/controllers/with-auth-guard.controller';

@Controller('inventory-item')
@ApiTags('Имущество')
export class InventoryItemController extends WithAuthGuardController {
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
    @ApiExtraModels(ErrorDto)
    @ApiOkResponse({
        schema: {
            oneOf: [
                {
                    description: 'Модель',
                    properties: {
                        response: {
                            $ref: getSchemaPath(InventoryItemOutDto),
                        },
                    },
                },
                {
                    description: 'Сущность не найдена',
                    properties: {
                        error: {
                            type: 'object',
                            $ref: getSchemaPath(ErrorDto),
                        },
                    },
                },
            ],
        },
    })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: string) {
        try {
            const result = await this.inventoryItemService.findOne(Number(id));

            return this.wrapResponse(new InventoryItemOutDto(result));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @ApiOperation({
        summary: 'Обновить имущество',
        description:
            'Запроса для обновления имущества, обновляются только те поля которые отправлены',
    })
    @ApiExtraModels(InventoryItemOutDto, ErrorDto, CreateInventoryItemDto)
    @ApiBody({
        schema: {
            type: 'object',
            $ref: getSchemaPath(CreateInventoryItemDto),
        },
    })
    @ApiOkResponse({
        schema: {
            oneOf: [
                {
                    properties: {
                        response: {
                            type: 'object',
                            $ref: getSchemaPath(InventoryItemOutDto),
                        },
                    },
                },
                {
                    properties: {
                        error: {
                            type: 'object',
                            $ref: getSchemaPath(ErrorDto),
                        },
                    },
                },
            ],
        },
    })
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateInventoryItemDto: UpdateInventoryItemDto,
    ) {
        try {
            const result = await this.inventoryItemService.update(
                Number(id),
                updateInventoryItemDto,
            );

            return this.wrapResponse(new InventoryItemOutDto(result));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }

    @ApiOperation({
        summary: 'Удалить элемент имущества',
        description: 'Запрос на удаления имущества',
    })
    @ApiExtraModels(SuccessDto)
    @ApiOkResponse({
        schema: {
            properties: {
                response: {
                    type: 'object',
                    $ref: getSchemaPath(SuccessDto),
                    example: true,
                },
            },
        },
    })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: string) {
        try {
            await this.inventoryItemService.remove(Number(id));

            return this.wrapResponse(new SuccessDto(true));
        } catch (e) {
            if (this.isExceptionApi(e)) {
                return this.wrapError(e.getApiError());
            }

            throw e;
        }
    }
}
