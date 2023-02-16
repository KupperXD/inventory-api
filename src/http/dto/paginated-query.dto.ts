import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedQueryDto {
    @ApiProperty({
        title: 'Page',
        default: 0,
        type: Number,
        required: false,
    })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    public page: number = 1;
}
