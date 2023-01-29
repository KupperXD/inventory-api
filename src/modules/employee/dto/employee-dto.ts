import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';

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

    constructor(employee: Employee) {
        this.name = employee.name;
        this.email = employee.email;
        this.id = employee.id;
    }
}
