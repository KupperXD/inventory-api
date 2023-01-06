import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { compare, hash } from 'bcrypt';
import { UserDto } from '../dto/user.dto';
import ApiServiceException from '../../../exceptions/api-service.exception';
import EntityNotFoundError from '../../../http/errors/entity-not-found.error';
import UserRepository from '../repository/user.repository';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository) {}

    public async getByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return user;
    }

    public async create(userData: CreateUserDto) {
        const passwordHash = await hash(userData.password, 10);

        const createdUser = await this.userRepository.create({
            ...userData,
            password: passwordHash,
        });

        return {
            ...createdUser,
            password: null,
        };
    }

    public async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await hash(refreshToken, 10);

        await this.userRepository.update(userId, {
            currentHashedRefreshToken,
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
        return this.userRepository.update(userId, {
            currentHashedRefreshToken: null,
        });
    }

    async getById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new ApiServiceException(new EntityNotFoundError());
        }

        return user;
    }
}
