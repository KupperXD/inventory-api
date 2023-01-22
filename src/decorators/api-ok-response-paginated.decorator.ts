import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedCollectionDto } from '../http/dto/paginated-collection.dto';

export const ApiOkResponsePaginatedDecorator = <DataDto extends Type<unknown>>(
    dataDto: DataDto,
) => {
    return applyDecorators(
        ApiExtraModels(PaginatedCollectionDto, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedCollectionDto) },
                    {
                        properties: {
                            items: {
                                type: 'array',
                                items: { $ref: getSchemaPath(dataDto) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};
