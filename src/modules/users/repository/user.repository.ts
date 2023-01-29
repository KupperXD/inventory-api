import { BaseRepository } from '../../../components/base.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Logger } from '../../logger/service/logger.service';
import { PrismaClientKnownRequestError } from 'prisma/prisma-client/runtime';
import { PrismaError } from '../../../enums/prismaError';
import { RepositoryException } from '../../../exceptions/repository.exception';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';

@Injectable()
export default class UserRepository extends BaseRepository<User> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) {
        super();
    }

    async create<DTO extends CreateUserDto>(dto: DTO) {
        try {
            return await this.prisma.user.create({
                data: dto,
            });
        } catch (e) {
            await this.handleError(e);
            throw e;
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    id,
                },
            });
        } catch (e) {
            await this.handleError(e);
            throw e;
        }
    }

    async update<DTO extends UpdateUserDto>(id: number, dto: DTO) {
        try {
            return await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    ...dto,
                },
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

    async delete(id: number): Promise<boolean> {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id,
                },
            });

            return !!user;
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

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
        } catch (e) {
            await this.handleError(e);
            throw e;
        }
    }

    private async handleError(error: unknown): Promise<void> {
        this.logger.error(error?.toString());
    }
}
