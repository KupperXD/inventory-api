import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateEmployeeDto)
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
