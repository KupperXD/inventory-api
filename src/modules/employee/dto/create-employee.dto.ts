import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Unique } from '../../../validators/unique-constraint.validator';

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsEmail()
    @Unique(['employee', 'email'])
    public email: string;

    @IsNotEmpty()
    @IsString()
    public name: string;
}
