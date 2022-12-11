import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeDto } from '../dto/employee-dto';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentication.guard';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post()
    create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
        return this.employeeService.create(createEmployeeDto);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    findAll(): Promise<EmployeeDto[]> {
        return this.employeeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<EmployeeDto> {
        return this.employeeService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.employeeService.update(+id, updateEmployeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeeService.remove(+id);
    }
}
