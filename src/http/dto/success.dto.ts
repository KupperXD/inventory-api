import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
    @ApiProperty({
        type: Boolean,
    })
    public success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }
}
