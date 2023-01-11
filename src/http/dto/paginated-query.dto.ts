import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedQueryDto {
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    public page: number;
}
