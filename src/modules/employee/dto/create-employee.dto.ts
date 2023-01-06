import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Unique } from '../../../validators/unique-constraint.validator';

export class CreateEmployeeDto {
    @Unique(['employee', 'email'])
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public name: string;
}
