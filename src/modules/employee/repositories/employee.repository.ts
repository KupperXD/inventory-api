import { Prisma, Employee } from '@prisma/client';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PaginationRepository } from '../../../components/pagination/pagination.repository';
import { Logger } from '../../logger/service/logger.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../../../enums/prismaError';
import { RepositoryException } from '../../../exceptions/repository.exception';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';

@Injectable()
export class EmployeeRepository extends PaginationRepository<Employee> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) {
        super(prisma.employee);
    }

    async create(dto: CreateEmployeeDto): Promise<Employee> {
        try {
            return await this.prisma.employee.create({
                data: dto,
            });
        } catch (e) {
            await this.handleError(e);

            throw e;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const employee = await this.prisma.employee.delete({
                where: {
                    id,
                },
            });

            return !!employee;
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === PrismaError.NOT_FOUND
            ) {
                return Promise.reject(
                    new RepositoryException(new EntityNotFoundError()),
                );
            }

            await this.handleError(e);
            throw e;
        }
    }

    async findOne(id: number): Promise<Employee> {
        try {
            return await this.prisma.employee.findUnique({
                where: {
                    id,
                },
            });
        } catch (e) {
            await this.handleError(e);

            throw e;
        }
    }

    async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
        try {
            return await this.prisma.employee.update({
                where: {
                    id,
                },
                data: dto,
            });
        } catch (e) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === PrismaError.NOT_FOUND
            ) {
                return Promise.reject(
                    new RepositoryException(new EntityNotFoundError()),
                );
            }

            await this.handleError(e);
            throw e;
        }
    }

    private async handleError(error: unknown): Promise<void> {
        this.logger.error(error?.toString());
    }
}
