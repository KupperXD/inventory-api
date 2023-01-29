import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorDto } from '../dto/errors/error.dto';

export const ApiOkResponseWithErrorDecorator = <DataDto extends Type<unknown>>(
    dto: DataDto,
) => {
    return applyDecorators(
        ApiExtraModels(ErrorDto, dto),
        ApiOkResponse({
            schema: {
                oneOf: [
                    {
                        properties: {
                            response: {
                                type: 'object',
                                $ref: getSchemaPath(dto),
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
        }),
    );
};
