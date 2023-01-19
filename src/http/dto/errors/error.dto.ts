import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../../errors/enum/error-code.enum';

export class ErrorDto {
    @ApiProperty({
        description: '',
        type: 'Number',
        example: ErrorCode.UNKNOWN,
        required: false,
    })
    public code: number;

    @ApiProperty({
        description: 'Описание ошибки',
        type: 'String',
        example: '',
        required: false,
    })
    public message: number;
}
