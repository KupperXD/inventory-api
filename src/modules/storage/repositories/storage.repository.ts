import { StoredFile } from '@prisma/client';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CanFindOneInterface } from '../../../interfaces/colletions/can-find-one.interface';
import { CanCreateInterface } from '../../../interfaces/colletions/can-create.interface';
import { CreateFileDto } from '../dto/create-file.dto';
import { Injectable } from '@nestjs/common';
import { Logger } from '../../logger/service/logger.service';

@Injectable()
export class StorageRepository
    implements CanFindOneInterface<StoredFile>, CanCreateInterface<StoredFile>
{
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) {}

    async create(dto: CreateFileDto) {
        try {
            return await this.prisma.storedFile.create({
                data: dto,
            });
        } catch (e) {
            this.handleError(e);
            throw e;
        }
    }

    async findOne(id: number) {
        try {
            return await this.prisma.storedFile.findUnique({
                where: {
                    id,
                },
            });
        } catch (e) {
            this.handleError(e);
            throw e;
        }
    }

    private handleError(e: unknown): void {
        this.logger.error(e.toString());
    }
}
