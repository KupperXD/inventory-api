import { BaseRepository } from '../../../components/base.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export default class UserRepository extends BaseRepository<User> {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async create<DTO extends CreateUserDto>(dto: DTO) {
        return await this.prisma.user.create({
            data: dto,
        });
    }

    async findOne(id: number): Promise<User> {
        return await this.prisma.user.findFirst({
            where: {
                id,
            },
        });
    }

    async update<DTO extends UpdateUserDto>(id: number, dto: DTO) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...dto,
            },
        });
    }

    async delete(id: number): Promise<boolean> {
        const user = await this.prisma.user.delete({
            where: {
                id,
            },
        });

        return Promise.resolve(!!user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
}
