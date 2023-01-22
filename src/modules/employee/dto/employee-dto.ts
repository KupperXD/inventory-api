import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
    @ApiProperty({
        type: Number,
        description: 'ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        type: String,
        description: 'email',
        example: 'email@email.com',
    })
    email: string;

    @ApiProperty({
        type: String,
        description: 'имя',
        example: 'Дима',
    })
    name: string;
}
