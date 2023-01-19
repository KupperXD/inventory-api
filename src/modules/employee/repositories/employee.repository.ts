import { Prisma, Employee } from '@prisma/client';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PaginationRepository } from '../../../components/pagination/pagination.repository';

@Injectable()
export class EmployeeRepository extends PaginationRepository<Employee> {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.employee);
    }

    async create(dto: CreateEmployeeDto): Promise<Employee> {
        return await this.prisma.employee.create({
            data: dto,
        });
    }

    async delete(id: number): Promise<boolean> {
        const employee = await this.prisma.employee.delete({
            where: {
                id,
            },
        });

        return !!employee;
    }

    async findOne(id: number): Promise<Employee> {
        return await this.prisma.employee.findUnique({
            where: {
                id,
            },
        });
    }

    async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
        return await this.prisma.employee.update({
            where: {
                id,
            },
            data: dto,
        });
    }
}
