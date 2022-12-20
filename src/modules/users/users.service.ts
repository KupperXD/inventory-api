import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { UserDto } from './dto/user.dto';
import ApiServiceException from '../../exceptions/api-service.exception';
import EntityNotFoundError from '../../http/errors/entity-not-found.error';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    public async getByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return user;
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

    public async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await hash(refreshToken, 10);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                currentHashedRefreshToken,
            },
        });
    }

    async getUserIfRefreshTokenMatches(
        refreshToken: string,
        userId: number,
    ): Promise<UserDto> {
        const user = await this.getById(userId);

        const isRefreshTokenMatches = await compare(
            refreshToken,
            user.currentHashedRefreshToken,
        );

        if (isRefreshTokenMatches) {
            return user;
        }
    }

    async removeRefreshToken(userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                currentHashedRefreshToken: null,
            },
        });
    }

    async getById(id: number): Promise<UserDto> {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (!user) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return user;
    }
}
