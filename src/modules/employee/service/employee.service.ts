import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PrismaService } from 'nestjs-prisma';
import ApiServiceException from '../../../exceptions/api-service.exception';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';

@Injectable()
export class EmployeeService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createEmployeeDto: CreateEmployeeDto) {
        return await this.prisma.employee.create({
            data: createEmployeeDto,
        });
    }

    async findAll() {
        const employees = await this.prisma.employee.findMany();

        return employees;
    }

    async findOne(id: number) {
        const employee = await this.prisma.employee.findUnique({
            where: {
                id,
            },
        });

        if (!employee) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return employee;
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        const model = await this.findOne(id);

        return await this.prisma.employee.update({
            data: {
                ...model,
                ...updateEmployeeDto,
            },
            where: {
                id,
            },
        });
    }

    remove(id: number) {
        return `This action removes a #${id} employee`;
    }
}
