import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    public async getByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user) {
            return user;
        }

        throw new HttpException(
            'User with this email does not exist',
            HttpStatus.NOT_FOUND,
        );
    }

    public async create(userData: CreateUserDto) {
        const passwordHash = await hash(userData.password, 10);

        const createdUser = await this.prisma.user.create({
            data: {
                ...userData,
                password: passwordHash,
            },
        });

        return {
            ...createdUser,
            password: null,
        };
    }

    async getById(id: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (user) {
            return user;
        }

        throw new HttpException(
            'User with this id does not exist',
            HttpStatus.NOT_FOUND,
        );
    }
}
