import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessDto } from '../dto/success.dto';

export const SuccessResponseDecorator = () => {
    return applyDecorators(
        ApiExtraModels(SuccessDto),
        ApiOkResponse({
            schema: {
                properties: {
                    response: {
                        type: 'object',
                        $ref: getSchemaPath(SuccessDto),
                    },
                },
            },
        }),
    );
};
