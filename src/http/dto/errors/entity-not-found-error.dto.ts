import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../errors/enum/error-code.enum';

export class EntityNotFoundErrorDto {
    @ApiProperty({
        description: '',
        type: 'Number',
        example: ErrorCode.ENTITY_NOT_FOUND,
        required: false,
    })
    public code: number;

    @ApiProperty({
        description: '',
        type: 'String',
        example: '',
        required: false,
    })
    public message: number;
}
