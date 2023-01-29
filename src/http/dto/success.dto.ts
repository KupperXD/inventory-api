import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
    @ApiProperty({
        type: Boolean,
        example: true,
        description: 'Успех операции',
    })
    public success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }
}
