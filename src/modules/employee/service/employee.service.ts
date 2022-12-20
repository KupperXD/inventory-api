import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PrismaService } from 'nestjs-prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../../../enums/prismaError';
import { EntityNotFoundException } from '../../../exceptions/entity-not-found.exception';

@Injectable()
export class EmployeeService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createEmployeeDto: CreateEmployeeDto) {
        return await this.prisma.employee.create({
            data: createEmployeeDto,
        });
    }

    async findAll() {
        const employees = this.prisma.employee.findMany();

        return employees;
    }

    async findOne(id: number) {
        const employee = await this.prisma.employee.findUnique({
            where: {
                id,
            },
        });

        if (!employee) {
            throw new EntityNotFoundException(id);
        }

        return employee;
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        try {
            return await this.prisma.employee.update({
                data: {
                    ...updateEmployeeDto,
                    id: undefined,
                },
                where: {
                    id,
                },
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new EntityNotFoundException(id);
            }

            throw error;
        }
    }

    remove(id: number) {
        return `This action removes a #${id} employee`;
    }
}
