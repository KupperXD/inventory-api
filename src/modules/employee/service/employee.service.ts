import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import ApiServiceException from '../../../exceptions/api-service.exception';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';
import { EmployeeRepository } from '../repositories/employee.repository';

@Injectable()
export class EmployeeService {
    private readonly PER_PAGE = 20;

    constructor(private readonly employeeRepository: EmployeeRepository) {}

    async create(createEmployeeDto: CreateEmployeeDto) {
        return await this.employeeRepository.create(createEmployeeDto);
    }

    async findAllPaginated(page: number) {
        return await this.employeeRepository.paginate({
            page,
            perPage: this.PER_PAGE,
        });
    }

    async findOne(id: number) {
        const employee = await this.employeeRepository.findOne(id);

        if (!employee) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return employee;
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        return await this.employeeRepository.update(id, updateEmployeeDto);
    }

    async remove(id: number) {
        try {
            await this.employeeRepository.delete(id);
        } catch (e) {
            console.log('error delete', {
                e,
            });
            throw new ApiServiceException(new EntityNotFoundError());
        }
    }
}
