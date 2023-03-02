import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import ApiServiceException from '../../../exceptions/api-service.exception';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';
import { EmployeeRepository } from '../repositories/employee.repository';
import { RepositoryException } from '../../../exceptions/repository.exception';

@Injectable()
export class EmployeeService {
    private readonly PER_PAGE = 20;

    constructor(private readonly employeeRepository: EmployeeRepository) {}

    async create(createEmployeeDto: CreateEmployeeDto) {
        try {
            return await this.employeeRepository.create(createEmployeeDto);
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(new ApiServiceException(e.getApiError()));
            }

            throw e;
        }
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
        try {
            return await this.employeeRepository.update(id, updateEmployeeDto);
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(new ApiServiceException(e.getApiError()));
            }

            throw e;
        }
    }

    async findMany() {
        try {
            return await this.employeeRepository.findAll();
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(new ApiServiceException(e.getApiError()));
            }

            throw e;
        }
    }

    async remove(id: number) {
        try {
            await this.employeeRepository.delete(id);
        } catch (e) {
            if (e instanceof RepositoryException) {
                return Promise.reject(new ApiServiceException(e.getApiError()));
            }

            throw e;
        }
    }
}
