import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpecificationDto {
    @ApiProperty({
        description: 'Название атрибута',
        type: 'string',
    })
    @IsString()
    @IsNotEmpty()
    public label: string;

    @IsString()
    @IsNotEmpty()
    public value: string;
}
