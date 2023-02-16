import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Unique } from '../../../validators/unique-constraint.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({
        type: String,
        description: 'Уникальный email сотрудника',
        example: 'email@email.com',
    })
    @Unique(['employee', 'email', 'id'])
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @ApiProperty({
        type: String,
        description: 'Имя сотрудника',
        example: 'Саша',
    })
    @IsNotEmpty()
    @IsString()
    public name: string;
}
