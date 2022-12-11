import { Module } from '@nestjs/common';
import { EmployeeService } from './service/employee.service';
import { EmployeeController } from './controllers/employee.controller';

@Module({
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule {}
