import { CreateEmployeeDto } from './create-employee.dto';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ApiExtraModels(CreateEmployeeDto)
export class UpdateEmployeeDto extends CreateEmployeeDto {
    @ApiProperty({
        type: Number,
        description: 'id сущности',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    public id: number;
}
