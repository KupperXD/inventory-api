import { Module } from '@nestjs/common';
import { EmployeeService } from './service/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeRepository } from './repository/employee.repository';

@Module({
    controllers: [EmployeeController],
    providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
